/* ═══════════════════════════════════════════════════════════════════════
   🐱 서울 스킨 아뜰리에 — 제품 마스터 (하이롱 전용 편집 파일)
   ───────────────────────────────────────────────────────────────────────
   ✅ 이 파일만 고치면 사이트 제품 정보가 바뀝니다. 코드(kr-survey.html)는 건드리지 마세요.
   ✅ 고칠 수 있는 것:  가격 / 쿠팡 링크 / 판정 / 제형·필터 속성
   ✅ 규칙 3가지만 지키면 안전해요:
        1) 각 줄은  '제품명': { ... },   형태.  맨 끝의 쉼표(,) 지우지 마세요.
        2) 값은 따옴표 안에.  숫자(price)만 따옴표 없이.
        3) 제품명(맨 앞 '...')은 kr-survey.html의 슬롯 이름과 정확히 같아야 매칭돼요.
           (제품을 통째로 바꾸려면 슬롯 이름도 함께 바꿔야 하니, 그건 알려주세요)

   ⚠️ 2026-07-29 — 올리브영 → 쿠팡 파트너스 전환 (KR_coupang_전환.md 참고)
   올영 쇼핑 큐레이터가 개인 웹사이트를 등록 채널로 인정하지 않아, 구매 링크를
   쿠팡 파트너스로 전환했어요. 올영은 "후보 검증 신호"(랭킹·어워즈)로만 계속 쓰고,
   실제 구매 링크는 전부 쿠팡으로 나가요.

   📌 price       = 쿠팡 기준가(숫자, 원). ⚠️ 올영 정가 아님 — 지금 값은 올영 정가 기준
                    임시값이 섞여 있으니, 쿠팡 실제 판매가로 확인 후 갱신해주세요.
   📌 coupangUrl  = 쿠팡 파트너스 '링크 생성'으로 발급한 "상품 상세페이지" 링크
                    (link.coupang.com/a/... 형태). 이게 있으면 버튼이 이 링크로 연결돼요.
   📌 coupangSearchUrl = ⚠️ 2026-07-29 신규 — coupangUrl이 아직 없을 때의 대체 링크.
                    쿠팡 파트너스에서 "검색 결과"를 대상으로도 링크 생성이 가능해요
                    (제품명으로 검색한 결과 페이지 링크). 이것도 파트너스 링크 생성 기능으로
                    만들어야 수수료가 붙어요 — 쿠팡 주소창 URL을 그냥 복사하면 안 돼요.
                    coupangUrl과 coupangSearchUrl이 둘 다 비어있는 제품만 구매 버튼이 안 떠요.
                    버튼 문구는 둘 중 뭐가 걸리든 항상 "🛒 쿠팡에서 보기"로 동일해요
                    (유저 입장에선 검증됐는지 아닌지 구분할 필요가 없어서요).
   📌 coupangSellerType = 판매자 확인 결과(내부 기록용, 화면엔 절대 노출 안 함). 셋 중 하나만:
                    'rocket'(로켓배송) / 'brand_official'(브랜드 공식판매자) / 'brandstore'(쿠팡 브랜드스토어)
                    → coupangUrl(상품 상세페이지 링크)을 채우기 전에 반드시 확인하고 여기 기록하세요.
                    coupangSearchUrl(검색 링크)은 여러 판매자가 섞이니 이 필드 확인 없이도 생성 가능해요.
   📌 coupangVerifiedAt = 판매자·링크를 확인한 날짜 ('YYYY-MM-DD'). 재검수 주기 관리용.
   📌 oyCuratorUrl = 올영 큐레이터 링크(보존용). 올영이 웹사이트 등록을 재승인하면
                    부활시킬 수 있게 컬럼만 남겨둔 거예요. 지금은 전부 공란, 안 씀.
   📌 verdict     = 가격 판정. 아래 5개 중 하나만:
                    'BEST_VALUE'(가성비형) / 'WORTH_IT'(값 하는 제품) /
                    'HIDDEN_GEM'(숨은 보석) / 'FORMULATION_VALUE'(처방으로 값) /
                    'OVERPRICED'(오버프라이스 — 예산 무관 자동 제외)
                    ⚠️ 리포트에서 배지로는 안 보여줘요(무슨 뜻인지 모른다는 피드백으로 제거).
                    가격 논리는 전부 priceReason 문장으로 풀어서 보여줘요.
   📌 priceReason = "왜 이 제품이에요?"에 붙는 가격 설명 한 줄. ⚠️ 필수 — 비우면 안 됨.
   ───────────────────────────────────────────────────────────────────────
   ⚠️ price는 쿠팡 실제 판매가 확인 후 최종 확정하세요(지금은 올영 기준 임시값 포함).
   ⚠️ coupangUrl은 쿠팡 파트너스에서 제품별로 '링크 생성' 후 채우세요.
      판매자 확인(로켓배송/브랜드공식/브랜드스토어) 전에는 절대 채우지 마세요 — 가품 리스크.
      (파트너스 ID: AF5655860 — 링크 생성 시 자동 포함되므로 여기 따로 안 적어도 돼요)
   ═══════════════════════════════════════════════════════════════════════ */

window.KR_PRODUCTS = {

  /* ── 클렌저 (세안 규칙 카드의 "클렌저 추천 받기" 접기/펴기용) ──────── */
  '라운드랩 1025 독도 클렌저':
    { price:15000, coupangUrl:'https://link.coupang.com/a/fMu7sqwN4e', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'저자극 약산성 젤 클렌저예요. 뽀득거림 없이 씻겨서, 이 가격이면 충분해요.',
      tier:'commodity', texture:'light', sensitive_safe:true },
  '일리윤 세라마이드 아토 클렌저':
    { price:14900, coupangUrl:'https://link.coupang.com/a/fMvyu64XfM', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'세라마이드 함유 약산성 클렌저. 씻은 후 당김이 적어 이 가격이 적정해요.',
      tier:'commodity', texture:'light', sensitive_safe:true },
  '스킨1004 마다가스카르 센텔라 클렌징 폼':
    { price:12000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'무향·저자극 약산성 폼. 진정 성분 위주라 이 가격이면 착해요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },

  /* ── 토너 / 결 정돈 ─────────────────────────────────────────────── */
  '라운드랩 1025 독도 토너':
    { price:14000, coupangUrl:'https://link.coupang.com/a/fMvNIWbe9Y', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'판테놀·수분 위주라 성분값이 크지 않아요. 이 가격이 정답이에요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },
  '라운드랩 자작나무 수분 토너':
    { price:16000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'수분·진정 위주 커머디티 처방. 더 비쌀 이유가 없어요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },
  '스킨1004 마다가스카르 센텔라 토닝 토너':
    { price:18000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'센텔라 진정 토너. 커머디티 성분이라 적정가예요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },

  /* ── 피지·각질 (BHA) ────────────────────────────────────────────── */
  /* ⚠️ 2026-07-29 DB_패치안_매칭규칙.md — 판매자(coupangSellerType) 미확인 상태로 coupangUrl만
     등록되어 있던 규칙 위반 발견. 판매자 확인 전까지는 링크를 걸지 않는 원칙이라 URL을 비움.
     하이롱: 로켓배송/브랜드공식/브랜드스토어 확인되면 coupangUrl+coupangSellerType 함께 채워주세요. */
  '폴라초이스 2% BHA 리퀴드':
    { price:27600, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'FORMULATION_VALUE', priceReason:'살리실산 자체는 흔해요. 다만 효과를 좌우하는 pH 설계가 안정적이라 값을 해요. 예산이 2만원 이하면 아래 코스알엑스로 자동으로 바뀌어요.',
      tier:'commodity', texture:'light', active_type:'bha' },

  /* ── BHA 예산형 대안 (2만원 이하) ──
     ⚠️ 2026-07-29 신규 리서치 제품 — 가격은 리서치 기준 추정치, 쿠팡 실제가·판매자 확인 필요(하이롱) */
  '코스알엑스 BHA 블랙헤드 파워 리퀴드':
    { price:18000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'살리실산 자체는 커머디티 원료라, 이 가격이면 충분해요. 전 세계적으로 검증된 스테디셀러예요.',
      tier:'commodity', texture:'light', active_type:'bha' },

  /* ── 피지 조절 / 톤 (나이아신아마이드) ───────────────────────────── */
  '디오디너리 나이아신아마이드 10% + 징크 1%':
    { price:8700, coupangUrl:'https://link.coupang.com/a/fMwhymdeRE', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'같은 성분을 가장 싸게 담은 대표 가성비예요.',
      tier:'commodity', texture:'light', active_type:'none', brightening:'niacinamide', sensitive_safe:true },

  /* ── 수분 충전 (히알루론산) ──────────────────────────────────────── */
  '토리든 다이브인 저분자 히알루론산 세럼':
    { price:13560, coupangUrl:'https://link.coupang.com/a/fMwpotHtZY', coupangSearchUrl:'', coupangSellerType:'rocket', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'히알루론산은 흔한 성분이라 이 가격이 적정해요. (2025 올영 세럼 어워즈 1위)',
      tier:'commodity', texture:'light', active_type:'none', sensitive_safe:true, emergency_safe:true },

  /* ── 진정·장벽 앰플 (세라마이드 / 센텔라) ────────────────────────── */
  '일리윤 세라마이드 아토 컨센트레이트 앰플':
    { price:25000, coupangUrl:'https://link.coupang.com/a/fMwwt5HHlQ', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'세라마이드 앰플치고 가격이 착해요.',
      tier:'commodity', texture:'medium', sensitive_safe:true, emergency_safe:true },
  '스킨1004 마다가스카르 센텔라 앰플':
    { price:18000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'병풀 진정 앰플. 이 가격이면 부담 없어요. (올영 누적판매 1700만)',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },

  /* ── 마무리 보습 — barrier_repair (세라마이드, 장벽 손상·민감 전용) ──
     ⚠️ 2026-07-29 DB_패치안_매칭규칙.md — moisture_type 필드 신설. 이 6개는 전부 barrier_repair.
     화들짝형·응급형에만 1순위로 매칭할 것 — 파사삭형·번들번들형·겉번속건형·반반형엔 기본 배정 금지. */
  '에스트라 아토베리어365 크림':
    { price:23900, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'FORMULATION_VALUE', priceReason:'세라마이드는 흔하지만 저자극 장벽 처방으로 값을 해요. (올영 1등 크림)',
      tier:'commodity', texture:'rich', moisture_type:'barrier_repair', sensitive_safe:true, emergency_safe:true },
  /* ⚠️ 2026-07-29 하이롱 확인 — 제품명이 '에스트라 아토베리어365 젤크림'에서 '수딩젤'로 변경(쿠팡 실제 판매명 기준) */
  '에스트라 아토베리어365 수딩젤':
    { price:12400, coupangUrl:'https://link.coupang.com/a/fMwEacpc04', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'가벼운 세라마이드 보습이에요. 이 가격이면 충분해요.',
      tier:'commodity', texture:'light', moisture_type:'barrier_repair', sensitive_safe:true, emergency_safe:true },
  /* ⚠️ 2026-07-29 하이롱 확인 — 제품명이 '에스트라 아토베리어365 로션'에서 '로션 플러스'로 변경(쿠팡 실제 판매명 기준) */
  '에스트라 아토베리어365 로션 플러스':
    { price:29790, coupangUrl:'https://link.coupang.com/a/fMwLV5kuPI', coupangSearchUrl:'', coupangSellerType:'rocket', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'세라마이드 로션 제형. 부담 없는 가격이에요.',
      tier:'commodity', texture:'light', moisture_type:'barrier_repair', sensitive_safe:true, emergency_safe:true },
  '에스트라 아토베리어365 하이드로 에센스':
    { price:19360, coupangUrl:'https://link.coupang.com/a/fMwSBmUaiG', coupangSearchUrl:'', coupangSellerType:'rocket', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'가벼운 수분 에센스. 성분 대비 적정가예요.',
      tier:'commodity', texture:'light', moisture_type:'barrier_repair', sensitive_safe:true, emergency_safe:true },
  '일리윤 세라마이드 아토 로션':
    { price:15000, coupangUrl:'https://link.coupang.com/a/fMwXJSsUa4', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'무향 세라마이드 로션. 가성비 장벽 보습이에요.',
      tier:'commodity', texture:'light', moisture_type:'barrier_repair', sensitive_safe:true, emergency_safe:true },

  /* ── 마무리 보습 — emollient (스쿠알란, 건조+장벽건강 전용) ──
     ⚠️ 2026-07-29 DB_패치안_매칭규칙.md 신규 — 파사삭형(dry_sensitive) 1순위.
     지인 테스트에서 파사삭형 성향 2명이 독립적으로 이 제품을 쓰고 있던 게 근거. */
  '에스네이처 아쿠아 스쿠알란 수분크림':
    { price:22400, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'스쿠알란은 흔한 유분 성분이라 이 가격이면 합리적이에요.',
      tier:'commodity', texture:'light', moisture_type:'emollient', sensitive_safe:true },

  /* ── 마무리 보습 — hydrating (수분충전형, 번들번들형·겉번속건형·반반형 전용) ──
     ⚠️ 2026-07-29 DB_패치안_매칭규칙.md 신규 — 세라마이드 장벽복구가 아니라
     자작나무 수액 기반 수분 충전 젤크림. 지성이어도 무겁지 않게 씀. */
  '라운드랩 자작나무 수분 크림':
    { price:21000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'자작나무 수액 기반 커머디티 처방이라 이 가격이면 충분해요.',
      tier:'commodity', texture:'light', moisture_type:'hydrating', sensitive_safe:true },

  /* ── 자외선 차단 (Q10 마무리 finish별로 코드가 골라요) ──────────────
     finish=base/default·지성 → 라운드랩 자작나무(수분·무난, 화장 잘 받음)
     finish=natural·민감/응급/주사/눈시림회피 → 닥터지 그린 마일드 업(무기자차·백탁적음)
     finish=toneup → 메이크프렘 수딩 핑크 톤업(무기자차 톤업)
     실외 3시간+ → 닥터지 그린 마일드 업 선스틱(덧바르기 팁) */
  '라운드랩 자작나무 수분 선크림':
    { price:22000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'매일 쓰는 수분 선크림. 커머디티 처방이라 이 가격이면 충분해요.',
      tier:'commodity', texture:'light', sunscreen_filter:'hybrid', sensitive_safe:true, makeup_friendly:true },
  '닥터지 그린 마일드 업 선 플러스':
    { price:19900, coupangUrl:'https://link.coupang.com/a/fMxiXRKHRI', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'무기자차 민감 선크림 스테디셀러(올영 어워즈). 순한데 백탁이 적어요.',
      tier:'commodity', texture:'light', sunscreen_filter:'inorganic', whitecast:'low', sensitive_safe:true, emergency_safe:true },
  '메이크프렘 수딩 핑크 톤업 선크림':
    { price:20000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'무기자차 톤업 선크림. 파데 없이 이것만 발라도 화사해요.',
      tier:'commodity', texture:'light', sunscreen_filter:'inorganic', toneup:true, sensitive_safe:true },
  '닥터지 그린 마일드 업 선스틱':
    { price:16000, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'덧바르기용 무기자차 스틱. 화장 위에도 발려요.',
      tier:'commodity', texture:'light', sunscreen_filter:'inorganic', sensitive_safe:true },

  /* ── PIE(붉은 자국) 진정 / 액티브 대체(PHA·BHA 대신) ───────────────
     붉은 여드름 자국은 미백이 아니라 진정. PHA는 BHA 불내성 대체로도 씀 */
  '에스트라 에이시카365 흔적진정세럼':
    { price:23060, coupangUrl:'https://link.coupang.com/a/fMxpRrOYA8', coupangSearchUrl:'', coupangSellerType:'rocket', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'FORMULATION_VALUE', priceReason:'PHA로 순하게 각질 정리 + 시카 진정. 붉은 자국(PIE)·BHA 대체에 좋아요.',
      tier:'commodity', texture:'light', active_type:'pha', sensitive_safe:true },

  /* ── 액티브 대체 — 바쿠치올(레티놀 대체) / 비타민C 유도체(순수 비타민C 대체) ──
     ⚠️ 2026-07-29 신규 리서치 제품 — 가격은 리서치 기준 추정치, 쿠팡 실제가·판매자
     확인 필요(하이롱). 레티놀·순수 비타민C 불내성일 때만 코드가 이 제품들로 안내해요. */
  '반코르 바쿠치올 세럼 5000ppm':
    { price:22220, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'HIDDEN_GEM', priceReason:'바쿠치올은 원료 자체가 비싼 편인데, 5000ppm을 2만원대에 담아 이례적으로 저렴해요.',
      tier:'premium', texture:'light', active_type:'bakuchiol', sensitive_safe:true },
  '구달 청귤 비타C 잡티세럼 알파':
    { price:21900, coupangUrl:'https://link.coupang.com/a/fMxAdQk7DE', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'FORMULATION_VALUE', priceReason:'비타민C 유도체 자체는 흔하지만, 안정화 처방 덕에 순하면서도 효과가 유지돼 값을 해요.',
      tier:'commodity', texture:'light', active_type:'vitc_derivative', sensitive_safe:true },

  /* ── 기미(멜라스마) 전담 — 트라넥삼산 ── */
  '더마팩토리 트라넥삼산 6% 크림':
    { price:8000, coupangUrl:'https://link.coupang.com/a/fMxHWCTayy', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'트라넥삼산은 원료 자체가 저렴한 편이라, 저가 브랜드가 담아도 효과 농도(6%)면 충분해요. 비쌀 이유가 없어요.',
      tier:'commodity', texture:'light', sensitive_safe:true },

  /* ── 액티브 0 루틴용 — 순한 효소 각질 (산·스크럽 없이 각질만 정리) ── */
  '파파레서피 가지 효소 파우더 클렌저':
    { price:12680, coupangUrl:'https://link.coupang.com/a/fMxMtOLvc5', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'효소 파우더는 흔한 제형이라 이 가격이면 합리적이에요. 산 성분이 아니라 물에 녹여 쓰는 방식이라 훨씬 순해요.',
      tier:'commodity', texture:'light', active_type:'none', sensitive_safe:true },

  /* ── 아토피 대표 제품 (한계 고지와 함께 조심스럽게 안내) ──
     ⚠️ 2026-07-29 하이롱 확인 — 기존 '일리윤 세라마이드 아토 크림'(마무리보습 rich 대안)과 쿠팡 실판매 기준
     동일 상품으로 확인되어 이 항목 하나로 통합함. 마무리보습 rich 대안으로도, 아토피 한계고지 제품으로도 씀. */
  '일리윤 세라마이드 아토 집중크림':
    { price:23900, coupangUrl:'https://link.coupang.com/a/fMxah6YnLM', coupangSearchUrl:'', coupangSellerType:'brand_official', coupangVerifiedAt:'2026-07-29', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'세라마이드 집중 처방인데도 가격은 로션·크림 라인과 같아요. 흔한 원료라 비쌀 이유가 없어요.',
      tier:'commodity', texture:'rich', moisture_type:'barrier_repair', sensitive_safe:true, emergency_safe:true },

  /* ── 선크림 — organic(유기자차), 백탁 없이 가볍게. finish_natural(눈시림 회피 안 함) 전용 ──
     ⚠️ 2026-07-29 DB_패치안_매칭규칙.md 신규 — 기존 4개 선크림에 유기자차가 0개였던 공백 대응 */
  '구달 맑은 어성초 진정 수분 선크림':
    { price:19800, coupangUrl:'', coupangSearchUrl:'', coupangSellerType:'', coupangVerifiedAt:'', oyCuratorUrl:'',
      verdict:'BEST_VALUE', priceReason:'유기자차 필터 자체는 흔한 원료라 이 가격이면 충분해요.',
      tier:'commodity', texture:'light', sunscreen_filter:'organic', whitecast:'none', sensitive_safe:true }

};
