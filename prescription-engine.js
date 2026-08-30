(function (global) {
  'use strict';

  var STRENGTH = { none:0, mild:1, moderate:2, strong:3, high:3, needs_review:3 };
  var TIER = { primary:30, secondary:15, gated:5, excluded:-999 };
  var BUDGET = { value:20000, mid:40000, premium:70000, open:Infinity };

  function one(a, id) { return (a[id] || [])[0] || ''; }
  function has(a, id, text) { return (a[id] || []).indexOf(text) !== -1; }
  function includesAny(values, wanted) { return values.some(function (v) { return wanted.indexOf(v) !== -1; }); }
  function uniq(values) { return values.filter(function (v, i) { return v && values.indexOf(v) === i; }); }

  function buildProfile(input) {
    var a = input.answers || {}, f = input.flags || {}, tags = input.tags || [];
    var concerns = [];
    if (has(a,'q1','번들거림 — 기름이 너무 많아요')) concerns.push('oil_control','sebum_control');
    if (has(a,'q1','수분 부족 — 당기고 각질 일어나요')) concerns.push('hydration');
    if (has(a,'q1','블랙헤드·화이트헤드 — 모공이 막혀 보여요')) concerns.unshift('blackheads','whiteheads','comedonal_acne','clogged_pores');
    var troubleSelected=has(a,'q1','트러블 — 자꾸 뭐가 올라와요');
    var troubleShape=one(a,'q4');
    var currentTrouble=troubleSelected || (troubleShape && troubleShape!=='요즘은 거의 없어요');
    if (troubleSelected) concerns.push('acne','soothing');
    if (currentTrouble && troubleShape === '블랙헤드·좁쌀 — 피부 아래 오돌토돌') concerns.unshift('blackheads','pores','comedonal_acne');
    if (currentTrouble && troubleShape === '빨갛게 올라왔다 가라앉는 것') concerns.unshift('inflammatory_acne','soothing');
    if (has(a,'q1','모공 — 눈에 띄게 넓어 보여요')) concerns.push('pores','blackheads');
    if (has(a,'q1','칙칙함·잡티 — 톤이 고르지 않아요')) concerns.push('pigmentation','brightening');
    if (has(a,'q1','탄력·주름 — 슬슬 신경 쓰여요')) concerns.push('aging','wrinkles');
    if (has(a,'q1','얼굴이 자주 붉어져요 (홍조)')) concerns.push('redness','soothing');
    if (has(a,'q1b','특정 부위가 진하게 자리 잡았어요 (기미)')) concerns.unshift('melasma');
    if (has(a,'q1b','여드름 자국이 갈색으로 남아요')) concerns.unshift('pih');
    if (has(a,'q1b','여드름 자국이 붉게 남아요')) concerns.unshift('pie','soothing');
    if (has(a,'q1b','전체적으로 칙칙하고 생기가 없어요') || has(a,'q1b','잘 모르겠어요')) concerns.push('dullness');

    var skinType = input.archetype === 'balanced_oily' ? 'oily' : (input.archetype === 'dehydrated_oily' || input.archetype === 'combination_dehydrated') ? 'dehydrated_oily' : input.archetype === 'dehydrated_sensitive' ? 'sensitive' : (input.archetype === 'dry_sensitive' || input.archetype === 'dry') ? 'dry' : 'combination';
    var oilLevel = (input.dash && input.dash.oil_balance >= 65) || skinType === 'oily' ? 'high' : (skinType === 'dehydrated_oily' ? 'mixed_high' : 'normal');
    var activeConsent = one(a,'qactwant') !== '기능성 제품은 추천받지 않을래요' && !f.active_avoid;
    var exp = one(a,'qact');
    var level = f.active_tolerant ? 'experienced' : (exp === '기능성 성분을 사용해 본 적이 없어요' || exp === '기능성 성분인지 잘 모르겠어요' || f.active_naive ? 'beginner' : 'cautious');
    var maxStrength = level === 'experienced' && !f.chronic_sensitive ? 'moderate' : 'mild';
    if (level === 'beginner' && !f.chronic_sensitive && !f.emergency_state && includesAny(concerns,['blackheads','whiteheads','pores','clogged_pores'])) maxStrength = 'moderate';
    if (f.emergency_state || f.chronic_sensitive || f.active_intolerant) maxStrength = 'mild';
    var fail = f.active_fail || {};
    var activeRetry = f.active_want === 'retry' || one(a,'qactretry') === '낮은 강도로 다시 시도해볼래요';
    /* 재도전과 완전 회피를 분리한다. 낮은 강도로 재도전하겠다고 답한 경우에는
       실패 성분군을 통째로 막지 않고 mild 제품·대체 성분만 통과시킨다. */
    var hardAvoidFailed = !!f.active_failed_avoid || !!f.active_intolerant || !activeRetry;
    var excludedActives = [];
    if (hardAvoidFailed && fail.exfoliant) excludedActives.push('bha','aha','pha');
    if (hardAvoidFailed && fail.retinol) excludedActives.push('retinoid');
    if (hardAvoidFailed && fail.vitc) excludedActives.push('vitamin_c');
    if (hardAvoidFailed && fail.pigmentation) excludedActives.push('niacinamide','txa');
    if (f.active_avoid || !activeConsent) excludedActives.push('all');
    var textureAnswer = one(a,'qtex');
    var texture = /아무것도 안 바른/.test(textureAnswer) ? 'light' : /수분감/.test(textureAnswer) ? 'hydrating' : /유분감/.test(textureAnswer) ? 'rich' : (f.texture || 'unknown');
    var budget = BUDGET[f.budget || 'mid'];
    var rosacea = f.derm_referral_rosacea;
    var deferForSensitivity = f.chronic_sensitive || rosacea;
    var deferredSet = ['melasma','pih','pigmentation','brightening','dullness','aging','wrinkles'];
    var treatmentConcerns = deferForSensitivity ? uniq(concerns).filter(function(c){return deferredSet.indexOf(c)===-1;}) : uniq(concerns);
    var deferredConcerns = deferForSensitivity ? uniq(concerns).filter(function(c){return deferredSet.indexOf(c)!==-1;}) : [];
    var pattern = one(a,'qactpattern'), frequency = one(a,'qactfreq');
    var activeInstruction = /한꺼번에/.test(pattern) ? '기능성 성분은 같은 날 겹치지 말고 요일별로 나눠 시작하세요.'
      : /시간·요일/.test(pattern) ? '나눠 썼는데도 자극이 있었다면 한 성분만 남겨 낮은 강도로 다시 시작하세요.'
      : /한 번에 하나/.test(pattern) ? '한 성분씩 사용해도 자극이 있었다면 농도를 낮추거나 대체 성분을 선택하세요.'
      : /매일/.test(frequency) ? '처음부터 매일 쓰지 말고 주 1~2회로 시작하세요.' : '';
    var profile = {
      skinState: f.emergency_state ? 'acute_barrier_damage' : (f.chronic_sensitive ? 'chronically_sensitive' : 'stable'),
      skinType: skinType,
      oilLevel: oilLevel,
      concerns: uniq(concerns),
      treatmentConcerns: treatmentConcerns,
      deferredConcerns: deferredConcerns,
      primaryConcern: uniq(concerns)[0] || 'hydration',
      routineMode: f.emergency_state || rosacea ? 'minimal' : (activeConsent ? 'active_single' : 'basic'),
      maxProductCount: f.emergency_state ? 3 : 5,
      activeMaxCount: f.emergency_state || rosacea || f.derm_referral_acne || !activeConsent ? 0 : (f.chronic_sensitive ? 1 : (level === 'experienced' ? 2 : 1)),
      activeRequested: activeConsent,
      activeTreatmentBranchCount: Math.max((a.q1||[]).length,(a.q1b||[]).length),
      activeToleranceLevel: level,
      allowedStrength: maxStrength,
      excludedActiveTypes: uniq(excludedActives),
      activeUnknown: fail.unknown || false,
      activeRetry: activeRetry,
      failedActiveTypes: Object.keys(fail).filter(function(k){return fail[k];}),
      activeInstruction: activeInstruction,
      texture: texture,
      finish: f.finish || 'default',
      noOrganic: !!f.no_organic,
      uvExposure: tags.indexOf('high-uv') !== -1 ? 'high' : tags.indexOf('moderate-uv') !== -1 ? 'medium' : 'low',
      budgetMax: budget,
      firstCleanserWanted: one(a,'qcleanse') === '네, 추천받을래요',
      reactiveHistory: !!f.product_reactive_history,
      excludedFormulaTraits: uniq((f.allergy_avoid || []).concat((f.chronic_sensitive || f.product_reactive_history) ? ['fragrance','essential_oil'] : [])),
      referral: { acne:!!f.derm_referral_acne, rosacea:!!rosacea },
      warnings: uniq([f.derm_referral_acne ? '깊고 아픈 트러블은 화장품보다 피부과 진료가 우선이에요.' : '', rosacea ? '반복 홍조·실핏줄·화끈거림은 주사 가능성 확인을 위해 진료를 권해요.' : ''])
    };
    profile.hydrationScore = input.dash && typeof input.dash.hydration === 'number' ? input.dash.hydration : 50;
    profile.hydrationLow = profile.hydrationScore < 50;
    profile.parallelHydration = profile.hydrationLow && includesAny(profile.concerns,['pores','blackheads','whiteheads','clogged_pores','pigmentation','brightening','dullness','aging','wrinkles']);
    return profile;
  }

  function eligible(p, profile) {
    if (!p || p.catalog_role === 'excluded' || p.result_priority === 'hidden' || p.access_level === 'blocked' || p.recommendation_status === 'excluded' || p.data_status !== 'verified') return false;
    if (p.access_level === 'cautious' || p.recommendation_status === 'gated') {
      /* 산 성분 반응 이력이 있어도 사용자가 명시적으로 저강도 재시도를 선택했다면,
         mild + conditional 제품 한정으로 조건부 제안을 허용한다. */
      var cautiousRetryAllowed = profile.activeRetry && p.slot === 'active' &&
        (p.active_strength === 'mild' || p.irritation_risk === 'mild') &&
        p.result_priority === 'conditional';
      if (profile.activeToleranceLevel !== 'experienced' && !cautiousRetryAllowed) return false;
    }
    if (profile.skinState === 'acute_barrier_damage' && p.barrier_damage_fit === 'avoid') return false;
    if (profile.skinState === 'chronically_sensitive' && p.sensitive_fit === 'avoid') return false;
    if (p.slot === 'sunscreen' && profile.noOrganic && p.uv_filter_type !== 'mineral') return false;
    var cautions = p.caution_flag_list || [];
    if (profile.excludedFormulaTraits.some(function (x) { return cautions.some(function(c){ return c.indexOf(x) !== -1; }); })) return false;
    if (p.slot === 'active') {
      if (!profile.activeMaxCount) return false;
      var types = p.active_types || [];
      if (profile.excludedActiveTypes.indexOf('all') !== -1 || includesAny(types, profile.excludedActiveTypes)) return false;
      var irritationRisk=p.irritation_risk || p.active_strength;
      if ((STRENGTH[irritationRisk] || 0) > (STRENGTH[profile.allowedStrength] || 1)) return false;
      if (profile.activeUnknown && irritationRisk !== 'mild') return false;
      /* 화들짝형의 미백·노화 고민은 다음 단계다. 현재 진정/결 관리와 겹치지 않는 제품은 노출하지 않는다. */
      if (profile.skinState === 'chronically_sensitive' && profile.deferredConcerns.length) {
        var targets=p.target_concern_list||[];
        var deferredOnly=includesAny(targets,['dullness','post_inflammatory_hyperpigmentation','melasma','dark_spots','anti_aging','elasticity']);
        var currentSafe=includesAny(targets,['soothing','mild_exfoliation','pores','blackheads','whiteheads','comedonal_acne','clogged_pores','sebum']);
        if (deferredOnly && !currentSafe) return false;
      }
    }
    /* 유분이 높은 안정 피부에는 건성·중간/리치 보습제를 기본 추천하지 않는다.
       장벽이 실제로 손상된 경우에만 장벽 로션·크림을 다시 허용한다. */
    if (p.slot === 'moisturizer' && profile.skinState === 'stable' && profile.oilLevel === 'high') {
      var skinTargets=p.target_skin_types||[];
      if (skinTargets.indexOf('oily')===-1) return false;
    }
    if (p.slot === 'moisturizer' && profile.skinState === 'stable' && profile.skinType === 'dry') {
      var dryTargets=p.target_skin_types||[];
      if (dryTargets.indexOf('dry')===-1 && dryTargets.indexOf('all')===-1) return false;
    }
    return true;
  }

  function score(p, profile, role) {
    var priorityScore = {primary:30, alternative:12, conditional:4, hidden:-999};
    var s = priorityScore[p.result_priority] != null ? priorityScore[p.result_priority] : (TIER[p.recommendation_status] || 0);
    if (p.slot === role) s += 40;
    var skins = p.target_skin_types || [];
    if (skins.indexOf(profile.skinType) !== -1) s += 28;
    else if (skins.indexOf('all') !== -1) s += 8;
    if (profile.skinState === 'chronically_sensitive' && p.sensitive_fit === 'preferred') s += 18;
    if (profile.skinState === 'acute_barrier_damage' && p.barrier_damage_fit === 'preferred') s += 55;
    var concerns = p.target_concern_list || [];
    (profile.treatmentConcerns || profile.concerns).forEach(function(c){ if (concerns.indexOf(c) !== -1) s += 12; });
    /* 관찰 점수에서 수분이 부족하면 고민 선택 여부와 무관하게 기초 수분 제품을 우선한다. */
    if (profile.hydrationLow && (p.slot === 'skin' || p.slot === 'moisturizer') && concerns.indexOf('hydration') !== -1) s += 32;
    var types = p.active_types || [];
    if (p.slot === 'active') {
      if (profile.skinState === 'chronically_sensitive' && concerns.indexOf('soothing') !== -1) s += 45;
      if (profile.skinState === 'chronically_sensitive' && types.indexOf('pha') !== -1) s += 16;
      if (includesAny(profile.concerns,['blackheads','whiteheads','clogged_pores','pores','sebum_control']) && types.indexOf('bha') !== -1) s += 38;
      if (includesAny(profile.concerns,['melasma','pigmentation']) && types.indexOf('txa') !== -1) s += 38;
      if (includesAny(profile.concerns,['pih','dullness','brightening']) && types.indexOf('vitamin_c') !== -1) s += 28;
      if (includesAny(profile.concerns,['pih','pigmentation','brightening']) && types.indexOf('alpha_arbutin') !== -1) s += 34;
      if (includesAny(profile.concerns,['aging','wrinkles']) && types.indexOf('retinoid') !== -1) s += 38;
      if (profile.concerns.indexOf('pie') !== -1 && includesAny(types,['aha','bha','retinoid'])) s -= 30;
    }
    if (profile.texture === 'light' && /gel|watery|light|ampoule|serum/.test(`${p.texture}|${p.finish}`)) s += 9;
    if (profile.texture === 'hydrating' && /moist|hydr|cream|lotion/.test(`${p.texture}|${p.finish}`)) s += 9;
    if (profile.texture === 'rich' && /rich|balm|cream|oil/.test(`${p.texture}|${p.finish}`)) s += 9;
    if (p.slot === 'moisturizer' && profile.oilLevel === 'high') {
      if (/light|gel|soothing/.test(`${p.texture}|${p.finish}`)) s += 30;
      if (/medium|rich|oil/.test(`${p.texture}|${p.finish}`)) s -= 24;
    } else if (p.slot === 'moisturizer' && profile.oilLevel === 'mixed_high') {
      if (/light|gel|soothing/.test(`${p.texture}|${p.finish}`)) s += 16;
      if (/rich/.test(`${p.texture}|${p.finish}`)) s -= 14;
    }
    /* 선크림은 피부유형보다 사용자가 고른 마무리 목적이 구매 만족도에 더 직접적이다. */
    if (profile.finish === 'toneup_light' && /natural_pink_toneup|light_toneup/.test(`${p.product_type}|${p.finish}`)) s += 90;
    if (profile.finish === 'toneup_cover' && /cover|blur/.test(`${p.product_type}|${p.finish}`)) s += 90;
    if (profile.finish === 'toneup' && /tone|blur|tinted/.test(`${p.product_type}|${p.finish}`)) s += 80;
    if (profile.finish === 'base' && /base|glow/.test(`${p.product_type}|${p.finish}`)) s += 80;
    if (profile.finish === 'makeup') {
      if (includesAny(p.target_concern_list || [],['makeup_friendly']) && /hydr|serum|natural|moist/.test(`${p.product_type}|${p.finish}`)) s += 95;
      if (/tone|tinted|pink|beige|blur|cover/.test(`${p.product_type}|${p.finish}`)) s -= 75;
    }
    if (profile.finish === 'natural' && /natural/.test(`${p.product_type}|${p.finish}`)) s += 55;
    if (profile.finish === 'default') {
      if (/tone|tinted|blur|cover/.test(`${p.product_type}|${p.finish}`)) s -= 35;
      if (/natural|moisturizing_sunscreen|mineral_sunscreen/.test(`${p.product_type}|${p.finish}`)) s += 20;
    }
    if (profile.noOrganic && p.product_type === 'mineral_sunscreen') s += 30;
    /* 실외 시간이 길면 SPF 숫자를 더 올리는 대신, 같은 SPF50+/PA++++ 안에서
       물·땀 저항을 명시한 제품을 우선한다. 내수성 미표기 제품은 추정하지 않는다. */
    if (p.slot === 'sunscreen' && profile.uvExposure === 'high' && p.water_resistance === 'claimed') s += 35;
    if (p.price_krw && p.price_krw <= profile.budgetMax) s += 7;
    else if (p.price_krw && profile.budgetMax !== Infinity) s -= 18;
    return s;
  }

  function best(profile, role, predicate, used) {
    return (global.KR_PRODUCT_LIST || []).filter(function(p){ return p.slot === role && eligible(p,profile) && (!predicate || predicate(p)) && used.indexOf(p.id) === -1; })
      .map(function(p){ return { p:p, score:score(p,profile,role) }; })
      .sort(function(a,b){ return b.score-a.score || a.p.id-b.p.id; })[0];
  }
  function concernFocus(c) {
    if (includesAny([c],['blackheads','whiteheads','pores','comedonal_acne','clogged_pores','sebum_control'])) return 'pores';
    if (includesAny([c],['inflammatory_acne','acne'])) return 'acne';
    if (includesAny([c],['melasma','pih','pigmentation','brightening','dullness'])) return 'pigmentation';
    if (includesAny([c],['redness','pie','soothing'])) return 'redness';
    if (includesAny([c],['aging','wrinkles'])) return 'aging';
    return '';
  }
  function activeFocuses(profile) {
    var concerns=profile.treatmentConcerns||profile.concerns||[];
    var focuses=[];
    for (var i=0;i<concerns.length;i++) {
      var focus=concernFocus(concerns[i]);
      if (focus && focuses.indexOf(focus)===-1) focuses.push(focus);
    }
    return focuses;
  }
  function activeFocus(profile) { return activeFocuses(profile)[0] || ''; }
  function activeRelevant(p, profile, selectedFocus) {
    var focus=selectedFocus||activeFocus(profile), t=p.target_concern_list||[], a=p.active_types||[];
    /* 블랙헤드·화이트헤드는 PHA나 피지조절 성분만으로 직접 해결한다고 설명하지 않는다.
       모공 속 막힘을 직접 타깃으로 검증된 제품 또는 BHA만 고민 제품 후보로 인정한다. */
    if (focus==='pores' && (includesAny(t,['blackheads','whiteheads','comedonal_acne','clogged_pores']) || a.indexOf('bha')!==-1)) return true;
    if (focus==='acne' && includesAny(t,['comedonal_acne','soothing']) && !includesAny(a,['retinoid','aha'])) return true;
    /* 제품에 미량의 브라이트닝 성분이 들어 있다는 이유만으로 색소 제품으로 분류하지 않는다.
       실제 제품 타깃이 색소·칙칙함일 때만 톤 고민 후보가 된다. */
    if (focus==='pigmentation' && includesAny(t,['melasma','post_inflammatory_hyperpigmentation','post_acne_marks','dark_spots','uneven_tone','dullness','pigmentation','brightening'])) return true;
    if (focus==='aging' && (includesAny(t,['elasticity','anti_aging']) || includesAny(a,['retinoid','bakuchiol']))) return true;
    if (focus==='redness' && includesAny(t,['soothing','mild_exfoliation']) && !includesAny(a,['retinoid','bha','aha'])) return true;
    return false;
  }
  function usage(p) {
    var t = p.active_types || [];
    if (p.slot === 'cleansing') {
      if (p.product_type === 'cleansing_oil') return '저녁 · 마른 얼굴에 마사지 후 충분히 유화해 헹구기';
      if (p.product_type === 'cleansing_milk') return '저녁 · 마른 얼굴에 부드럽게 마사지하고 미지근한 물로 헹구기';
      if (p.product_type === 'micellar_water') return '저녁 · 화장솜을 충분히 적셔 문지르지 말고 닦은 뒤 물로 헹구기';
      return '아침 또는 저녁 · 30초 안팎으로 부드럽게 세안';
    }
    if (p.slot === 'sunscreen') return '아침 마지막 단계 · 충분한 양' + (p.water_resistance === 'claimed' ? ' · 물·땀 뒤에는 바로 덧바르기' : ' · 실외 활동 중 덧바르기');
    if (t.indexOf('retinoid') !== -1) return '밤 · 주 1~2회부터 · 다음날 선크림 필수';
    if (includesAny(t,['bha','aha','pha'])) return '밤 · 주 1~2회부터 · 다른 각질/레티노이드와 같은 날 피하기';
    if (t.indexOf('alpha_arbutin') !== -1) return '밤 · 주 2~3회부터 · 먼저 좁은 부위에 시험한 뒤 늘리기';
    if (p.slot === 'active') return '하루 1회부터 · 자극이 없으면 제품 안내 범위에서 늘리기';
    return '아침·저녁 · 세안 후 얇게 바르기';
  }
  function label(p, profile, selectedFocus) {
    if (p.slot === 'cleansing') return ['cleansing_oil','cleansing_milk','micellar_water'].indexOf(p.product_type)!==-1 ? '1차 클렌징' : '2차 클렌징';
    if (p.slot === 'skin') return /toner/.test(p.product_type) ? '스킨·토너' : '진정·수분';
    if (p.slot === 'moisturizer') return '마무리 보습';
    if (p.slot === 'sunscreen') return '자외선 차단';
    var focus=selectedFocus||activeFocus(profile);
    return focus==='pores' ? (profile.concerns.indexOf('whiteheads')!==-1 ? '블랙헤드·화이트헤드 관리' : '모공·블랙헤드 관리') : focus==='acne' ? '트러블 진정 관리' :
      focus==='pigmentation' ? (profile.concerns.indexOf('pih')!==-1 ? '갈색 자국·톤 관리' : profile.concerns.indexOf('melasma')!==-1 ? '기미·톤 관리' : '톤·잡티 관리') : focus==='redness' ? (profile.concerns.indexOf('pie')!==-1 ? '붉은 자국·결 진정 관리' : '붉어짐 진정 관리') :
      focus==='aging' ? '탄력·주름 관리' : '고민 집중 관리';
  }
  function userReason(p, profile, selectedFocus) {
    var a=p.active_types||[], focus=selectedFocus||activeFocus(profile), target=p.target_concern_list||[];
    if (p.product_type==='cleansing_oil') return '선크림과 메이크업은 잘 녹이고 향료는 뺀 제품이라, 저녁 첫 세안용으로 골랐어요.';
    if (p.product_type==='cleansing_milk') return '피부가 쉽게 당길 때도 부드럽게 닦을 수 있어, 건조한 피부의 첫 세안용으로 골랐어요.';
    if (p.product_type==='micellar_water') return '향료 없이 가볍게 닦이는 제품이라, 예민했던 경험이 있는 피부도 부담을 줄이기 좋아요.';
    if (p.product_type==='foam_cleanser') return profile.oilLevel==='high' ? '번들거림은 씻어내되 피부가 뻣뻣해지지 않도록, 매일 쓰기 편한 세안제로 골랐어요.' : '씻고 난 뒤 당김을 줄이면서도 매일 쓰기 편한 순한 세안제라 골랐어요.';
    if (p.slot==='sunscreen') {
      if (profile.finish==='toneup_cover') return '자외선을 막으면서 붉은기와 얼룩덜룩한 피부톤도 자연스럽게 가려줘서 골랐어요.';
      if (profile.finish==='toneup_light') return '자외선 차단과 함께 얼굴빛을 가볍게 밝혀주는 제품이라 골랐어요.';
      if (profile.finish==='base') return '들뜨지 않고 촉촉하게 밀착돼, 화장 전에 바르기 편한 제품이라 골랐어요.';
      if (profile.finish==='makeup') return '톤업 없이 촉촉하게 밀착되고, 그 위에 쿠션이나 파운데이션을 올리기 편한 제품이라 골랐어요.';
      if (profile.noOrganic) return '눈시림이 걱정된다고 해서 유기자차 성분을 빼고 고른 무기자차예요.';
      return '매일 손이 가는 사용감과 충분한 자외선 차단력을 함께 갖춘 제품이라 골랐어요.';
    }
    if (p.slot==='moisturizer') {
      if (profile.oilLevel==='high'||profile.oilLevel==='mixed_high') return '유분은 이미 충분해서, 무겁게 덮기보다 수분을 채우고 가볍게 마무리되는 제품으로 골랐어요.';
      if (profile.skinState!=='stable'||includesAny(target,['barrier_repair','soothing'])) return '쉽게 예민해지는 피부를 편안하게 감싸고 수분이 빠져나가지 않게 도와주는 제품이라 골랐어요.';
      return '건조함을 오래 잡아주면서 피부가 편안하게 느껴지는 보습제라 골랐어요.';
    }
    if (p.slot==='skin') return includesAny(target,['soothing','redness']) ? '붉고 예민해진 피부를 먼저 편안하게 달래는 데 잘 맞아 골랐어요.' : '세안 뒤 부족한 수분을 가볍게 채워 다음 제품이 편하게 발리도록 골랐어요.';
    if (a.indexOf('bha')!==-1) return '모공 안에 쌓인 피지와 묵은 각질이 빠져나오기 쉽게 정리해, 블랙헤드와 화이트헤드 관리에 골랐어요.';
    if (a.indexOf('pha')!==-1) return '강한 각질 성분보다 순하게 피부결을 정돈할 수 있어, 자극이 걱정될 때 골랐어요.';
    if (includesAny(a,['txa','vitamin_c'])) return '갈색 자국과 칙칙한 피부톤을 함께 관리할 수 있는 성분 구성이어서 골랐어요.';
    if (a.indexOf('alpha_arbutin')!==-1) return '자극을 느꼈던 미백 성분은 빼고, 알파 알부틴으로 갈색 자국을 관리할 수 있어 대체 제품으로 골랐어요.';
    if (a.indexOf('retinoid')!==-1) return '탄력과 잔주름을 함께 관리할 수 있고, 현재 사용 경험에 맞는 강도라 골랐어요.';
    if (a.indexOf('bakuchiol')!==-1) return '탄력은 관리하고 싶지만 레티놀 자극은 피하고 싶을 때 쓰기 좋은 대안이라 골랐어요.';
    if (focus==='redness'||includesAny(target,['soothing','redness'])) return '지금은 강한 기능성보다 붉어짐을 편안하게 달래는 게 먼저라 이 제품을 골랐어요.';
    return '지금 피부 고민과 원하는 사용감에 가장 잘 맞는 제품이라 골랐어요.';
  }
  function toSlot(hit, profile, selectedFocus) {
    if (!hit) return null; var p=hit.p;
    var useText=usage(p); if(p.slot==='active' && profile.activeInstruction) useText += ' · ' + profile.activeInstruction;
    var reason=userReason(p,profile,selectedFocus);
    if (profile.skinState==='chronically_sensitive' && p.product_name==='에스트라 에이시카365 흔적진정세럼') {
      reason=profile.concerns.indexOf('pih')!==-1
        ? '갈색 자국은 나이아신아마이드·비타민C 유도체로 천천히 보조하고, 병풀 진정 성분으로 자극 부담을 낮춘 제품이에요. PHA는 자국 제거가 아니라 거친 결을 정돈하는 보조 역할이에요.'
        : '지금은 강한 기능성보다 병풀 진정과 순한 PHA 결 정돈으로 피부 부담을 낮추는 것이 먼저라 골랐어요.';
    }
    var priority=p.slot==='moisturizer'||p.slot==='sunscreen'?'essential':(p.slot==='active'?'concern':'optional');
    return { label:label(p,profile,selectedFocus), slotType:p.slot, name:p.product_name, price:p.price_krw || 0, why:reason, use:useText, actives:p.active_types || [], coupangUrl:'', tier:p.recommendation_status, catalogRole:p.catalog_role, accessLevel:p.access_level, resultPriority:p.result_priority, priority:priority, matchScore:hit.score,
      productId:p.id, irritationRisk:p.irritation_risk || p.active_strength || 'none', cautionFlags:p.caution_flag_list || [],
      waterResistance:p.water_resistance || 'none', productType:p.product_type || '' };
  }

  /* 개별 제품 필터를 통과한 뒤 완성된 루틴 전체를 다시 검사한다.
     단순 성분 궁합 금지표가 아니라 자극 성분의 합산량과 같은 날 중복을 다룬다. */
  function finalRoutineSafetyCheck(profile, routine) {
    var changes=[], warnings=[];
    var maxLoad = profile.skinState === 'acute_barrier_damage' || profile.referral.rosacea || profile.referral.acne ? 0
      : profile.skinState === 'chronically_sensitive' ? 1
      : profile.activeToleranceLevel === 'experienced' ? 4 : 2;
    function load(slot) {
      var types=slot.actives||[], risk=slot.irritationRisk;
      if (!types.length) return 0;
      /* 보습제·선크림의 보조 나이아신아마이드 등은 액티브 슬롯과 같은 강도로 합산하지 않는다.
         스킨 단계에서는 실제 각질 성분(PHA)만 저강도 자극량으로 센다. */
      if (slot.slotType!=='active') return slot.slotType==='skin' && types.indexOf('pha')!==-1 ? 1 : 0;
      if (risk==='strong' || risk==='high' || risk==='needs_review') return 3;
      if (includesAny(types,['retinoid','retinal','bha','aha']) || risk==='moderate') return 2;
      if (includesAny(types,['pha','txa','vitamin_c','alpha_arbutin','bakuchiol','niacinamide'])) return 1;
      return slot.slotType==='active' ? 1 : 0;
    }
    function total() { return routine.slots.reduce(function(n,s){return n+load(s);},0); }

    var strongActive=routine.slots.some(function(s){return s.slotType==='active' && includesAny(s.actives||[],['bha','aha','retinoid','retinal']);});
    var phaSkinIndex=routine.slots.findIndex(function(s){return s.slotType==='skin' && (s.actives||[]).indexOf('pha')!==-1;});
    if (strongActive && phaSkinIndex!==-1) {
      var used=routine.slots.map(function(s){return s.productId;});
      var replacement=best(profile,'skin',function(p){return (p.active_types||[]).indexOf('pha')===-1;},used);
      if (replacement) {
        var oldName=routine.slots[phaSkinIndex].name;
        routine.slots[phaSkinIndex]=toSlot(replacement,profile);
        changes.push(oldName+' 대신 산 성분이 없는 수분·진정 제품으로 바꿨어요.');
      }
    }

    while (total() > maxLoad) {
      var candidates=routine.slots.map(function(s,i){return {s:s,i:i,l:load(s)};})
        .filter(function(x){return x.s.slotType==='active' && x.l>0;})
        .sort(function(a,b){return b.l-a.l || a.s.matchScore-b.s.matchScore;});
      if (!candidates.length) break;
      var removed=routine.slots.splice(candidates[0].i,1)[0];
      changes.push(removed.name+'은(는) 현재 피부의 허용 자극량을 넘어 이번 루틴에서 제외했어요.');
    }

    var activeSlots=routine.slots.filter(function(s){return s.slotType==='active';});
    var hasRetinoid=activeSlots.some(function(s){return includesAny(s.actives||[],['retinoid','retinal']);});
    var hasExfoliant=activeSlots.some(function(s){return includesAny(s.actives||[],['bha','aha','pha']);});
    if (hasRetinoid && hasExfoliant) {
      activeSlots.forEach(function(s){
        if (includesAny(s.actives||[],['retinoid','retinal','bha','aha','pha']) && s.use.indexOf('같은 날')===-1) s.use += ' · 레티노이드와 각질 성분은 같은 날 사용하지 않기';
      });
      warnings.push('레티노이드와 각질 성분은 같은 날 겹치지 말고 서로 다른 요일에 사용하세요.');
    }
    if (routine.slots.some(function(s){return s.slotType==='sunscreen' && s.waterResistance==='claimed';}) && !profile.firstCleanserWanted) {
      warnings.push('워터프루프 선크림은 저녁에 잔여감이 남지 않도록 충분히 세안하고, 필요하면 1차 클렌저를 사용하세요.');
    }
    return { status:changes.length?'adjusted':'passed', irritationLoad:total(), maxIrritationLoad:maxLoad, changes:changes, warnings:uniq(warnings) };
  }

  function buildRoutine(profile) {
    var used=[], slots=[], cleansers=[], activeHit=null, activeFocusUsed='', activeFallback=false;
    function take(hit, target, selectedFocus){ if (!hit) return; used.push(hit.p.id); target.push(toSlot(hit,profile,selectedFocus)); }
    if (profile.firstCleanserWanted) {
      var firstType = profile.skinState === 'chronically_sensitive' || profile.skinState === 'acute_barrier_damage' ? 'micellar_water'
        : profile.skinType === 'dry' ? 'cleansing_milk' : 'cleansing_oil';
      take(best(profile,'cleansing',function(p){return p.product_type===firstType;},used)
        || best(profile,'cleansing',function(p){return p.product_type==='cleansing_oil';},used),cleansers);
    }
    take(best(profile,'cleansing',function(p){return p.product_type==='foam_cleanser';},used),cleansers);
    take(best(profile,'skin',function(p){return !/cream/.test(p.product_type||'');},used),slots);
    if (profile.activeMaxCount) {
      var focusList=activeFocuses(profile);
      for (var fi=0;fi<focusList.length&&!activeHit;fi++) {
        activeHit=best(profile,'active',(function(focus){return function(p){return activeRelevant(p,profile,focus);};})(focusList[fi]),used);
        if (activeHit) { activeFocusUsed=focusList[fi]; activeFallback=fi>0; }
      }
      if (activeHit) {
        var activeSlot=toSlot(activeHit,profile,activeFocusUsed);
        used.push(activeHit.p.id);
        if (activeFallback) {
          var focusKo={pores:'모공',acne:'트러블',pigmentation:'톤·잡티',redness:'붉어짐',aging:'탄력·주름'};
          activeSlot._subNote='↪ 1순위 '+(focusKo[focusList[0]]||'고민')+'에 맞는 순한 제품이 없어 무리하지 않고, 다음 고민인 '+(focusKo[activeFocusUsed]||'피부 고민')+'부터 관리해요.';
        } else if (profile.activeRetry) {
          activeSlot._subNote='🌱 자극 경험을 반영해 같은 고민을 낮은 강도 또는 더 순한 대체 성분으로 다시 시작해요.';
        }
        slots.push(activeSlot);
      }
      if (profile.activeMaxCount > 1 && profile.activeTreatmentBranchCount > 1) {
        var nextFocus=focusList.filter(function(f){return f!==activeFocusUsed;})[0] || activeFocusUsed;
        take(best(profile,'active',function(p){return activeRelevant(p,profile,nextFocus);},used),slots,nextFocus);
      }
    }
    take(best(profile,'moisturizer',null,used),slots);
    take(best(profile,'sunscreen',null,used),slots);
    slots = slots.filter(Boolean).slice(0,profile.maxProductCount);
    var clean=cleansers.filter(Boolean);
    /* 유분이 높은 피부는 아침 물세안을 고정 권하지 않는다. 추천된 2차 클렌저를
       아침 루틴 첫 단계에 넣고, 건조·중성 피부에는 불필요한 세안을 강제하지 않는다. */
    var safetyCheck=finalRoutineSafetyCheck(profile,{slots:slots});
    var morningClean = (profile.oilLevel === 'high' || profile.oilLevel === 'mixed_high')
      ? clean.filter(function(s){return s.label==='2차 클렌징';}).map(function(s){return s.label;}) : [];
    var morning=morningClean.concat(slots.filter(function(s){return s.slotType!=='active';}).map(function(s){return s.label;}));
    var evening=clean.map(function(s){return s.label;}).concat(slots.filter(function(s){return s.label!=='자외선 차단';}).map(function(s){return s.label;}));
    var activeDecision={status:'not_requested',message:''};
    if (profile.activeRequested) {
      if (activeHit) activeDecision={status:'recommended',message:''};
      else if (profile.skinState==='acute_barrier_damage') activeDecision={status:'deferred',message:'지금은 피부 장벽 회복이 먼저라 기능성 제품을 잠시 미뤘어요.'};
      else if (profile.referral.rosacea) activeDecision={status:'deferred',message:'반복되는 붉어짐과 화끈거림은 진료 확인이 먼저라 기능성 제품을 넣지 않았어요.'};
      else if (profile.referral.acne) activeDecision={status:'deferred',message:'깊고 아픈 트러블은 화장품보다 진료가 먼저라 기능성 제품을 넣지 않았어요.'};
      else if (!activeFocus(profile)) activeDecision={status:'not_needed',message:'지금 선택한 고민은 강한 기능성보다 수분·진정·보습을 먼저 맞추는 편이 좋아 기능성 제품을 넣지 않았어요.'};
      else activeDecision={status:'coverage_gap',message:'대체 성분까지 확인했지만, 현재 DB에는 반응 이력·성분 강도·회피 성분 기준을 모두 통과한 제품이 없어 무리해서 추천하지 않았어요.'};
    }
    if (profile.activeRequested && activeHit && !slots.some(function(s){return s.slotType==='active';})) {
      activeDecision={status:'safety_limited',message:'제품 하나만 보면 사용할 수 있지만, 완성된 루틴의 총 자극량이 현재 피부 허용 범위를 넘어 이번에는 제외했어요.'};
    }
    var coreNote = profile.routineMode==='minimal' ? '지금은 진정·보습·자외선 차단만 유지하세요.'
      : profile.parallelHydration ? '수분 보완을 계속하면서 막힌 모공·톤 같은 고민 관리도 한 가지씩 함께 시작해요.'
      : '안전성과 현재 고민을 먼저 맞추고, 제형과 예산을 다음 기준으로 반영했어요.';
    return { cleansers:clean, slots:slots, order:{morning:morning,evening:evening}, activeDecision:activeDecision, safetyCheck:safetyCheck, coreNote:coreNote, parallelHydration:profile.parallelHydration };
  }
  function create(input) { var profile=buildProfile(input); return { profile:profile, routine:buildRoutine(profile) }; }
  global.SSA_ENGINE = { buildProfile:buildProfile, buildRoutine:buildRoutine, finalRoutineSafetyCheck:finalRoutineSafetyCheck, create:create, eligible:eligible, score:score };
})(window);
