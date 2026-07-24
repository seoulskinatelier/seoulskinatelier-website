/* ═══════════════════════════════════════════════════════════════════════
   🐱 서울 스킨 아뜰리에 — 제품 마스터 (하이롱 전용 편집 파일)
   ───────────────────────────────────────────────────────────────────────
   ✅ 이 파일만 고치면 사이트 제품 정보가 바뀝니다. 코드(kr-survey.html)는 건드리지 마세요.
   ✅ 고칠 수 있는 것:  가격 / 올영 링크 / 판정 배지 / 제형·필터 속성
   ✅ 규칙 3가지만 지키면 안전해요:
        1) 각 줄은  '제품명': { ... },   형태.  맨 끝의 쉼표(,) 지우지 마세요.
        2) 값은 따옴표 안에.  숫자(price)만 따옴표 없이.
        3) 제품명(맨 앞 '...')은 kr-survey.html의 슬롯 이름과 정확히 같아야 매칭돼요.
           (제품을 통째로 바꾸려면 슬롯 이름도 함께 바꿔야 하니, 그건 알려주세요)

   📌 price     = 올리브영 정가(숫자, 원). 세일가 말고 정가로.
   📌 oyUrl     = 올리브영 큐레이터/상품 링크. 비워두면('') 자동으로 올영 "검색"으로 연결돼요.
                  큐레이터 승인 후 제품별 링크를 여기에 붙여넣으면 됩니다.
   📌 verdict   = 가격 판정 배지. 아래 5개 중 하나만:
                  'BEST_VALUE'(가성비형) / 'WORTH_IT'(값 하는 제품) /
                  'HIDDEN_GEM'(숨은 보석) / 'FORMULATION_VALUE'(처방으로 값) /
                  'OVERPRICED'(오버프라이스 — 예산 무관 자동 제외)
   📌 priceReason = "왜 이 제품이에요?"에 붙는 가격 설명 한 줄.
   ───────────────────────────────────────────────────────────────────────
   ⚠️ price는 올영 실제 정가 확인 후 최종 확정하세요(지금은 임시값 포함).
   ⚠️ oyUrl은 올영 쇼핑 큐레이터 심사 통과 후 채우세요(지금은 전부 검색 링크로 동작).
   ═══════════════════════════════════════════════════════════════════════ */

window.KR_PRODUCTS = {

  /* ── 토너 / 결 정돈 ─────────────────────────────────────────────── */
  '라운드랩 1025 독도 토너':
    { price:14000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'판테놀·수분 위주라 성분값이 크지 않아요. 이 가격이 정답이에요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },
  '라운드랩 자작나무 수분 토너':
    { price:16000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'수분·진정 위주 커머디티 처방. 더 비쌀 이유가 없어요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },
  '스킨1004 마다가스카르 센텔라 토닝 토너':
    { price:18000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'센텔라 진정 토너. 커머디티 성분이라 적정가예요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },

  /* ── 피지·각질 (BHA) ────────────────────────────────────────────── */
  '폴라초이스 2% BHA 리퀴드':
    { price:39000, oyUrl:'', verdict:'FORMULATION_VALUE', priceReason:'살리실산 자체는 흔해요. 다만 효과를 좌우하는 pH 설계가 안정적이라 값을 해요. 더 저렴한 대안도 아래에 있어요.',
      tier:'commodity', texture:'light', active_type:'bha' },

  /* ── 피지 조절 / 톤 (나이아신아마이드) ───────────────────────────── */
  '디오디너리 나이아신아마이드 10% + 징크 1%':
    { price:13000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'같은 성분을 가장 싸게 담은 대표 가성비예요.',
      tier:'commodity', texture:'light', active_type:'none', brightening:'niacinamide', sensitive_safe:true },

  /* ── 수분 충전 (히알루론산) ──────────────────────────────────────── */
  '토리든 다이브인 저분자 히알루론산 세럼':
    { price:18000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'히알루론산은 흔한 성분이라 이 가격이 적정해요. (2025 올영 세럼 어워즈 1위)',
      tier:'commodity', texture:'light', active_type:'none', sensitive_safe:true, emergency_safe:true },

  /* ── 진정·장벽 앰플 (세라마이드 / 센텔라) ────────────────────────── */
  '일리윤 세라마이드 아토 컨센트레이트 앰플':
    { price:25000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'세라마이드 앰플치고 가격이 착해요.',
      tier:'commodity', texture:'medium', sensitive_safe:true, emergency_safe:true },
  '스킨1004 마다가스카르 센텔라 앰플':
    { price:18000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'병풀 진정 앰플. 이 가격이면 부담 없어요. (올영 누적판매 1700만)',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },

  /* ── 마무리 보습 (세라마이드) ────────────────────────────────────── */
  '에스트라 아토베리어365 크림':
    { price:28000, oyUrl:'', verdict:'FORMULATION_VALUE', priceReason:'세라마이드는 흔하지만 저자극 장벽 처방으로 값을 해요. (올영 1등 크림)',
      tier:'commodity', texture:'rich', sensitive_safe:true, emergency_safe:true },
  '에스트라 아토베리어365 젤크림':
    { price:30000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'가벼운 세라마이드 보습. 지성용으로 이 가격이면 충분해요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },
  '에스트라 아토베리어365 로션':
    { price:26000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'세라마이드 로션 제형. 부담 없는 가격이에요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },
  '에스트라 아토베리어365 하이드로 에센스':
    { price:25000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'가벼운 수분 에센스. 성분 대비 적정가예요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },
  '일리윤 세라마이드 아토 로션':
    { price:20000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'무향 세라마이드 로션. 가성비 장벽 보습이에요.',
      tier:'commodity', texture:'light', sensitive_safe:true, emergency_safe:true },
  '일리윤 세라마이드 아토 크림':
    { price:23000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'같은 라인 리치 버전. 여전히 착한 가격이에요.',
      tier:'commodity', texture:'rich', sensitive_safe:true, emergency_safe:true },

  /* ── 자외선 차단 (Q10 마무리 finish별로 코드가 골라요) ──────────────
     finish=base/default·지성 → 라운드랩 자작나무(수분·무난)
     finish=natural·민감/응급/주사 → 닥터지 그린 마일드 업(무기자차·백탁적음)
     finish=toneup → 메이크프렘 수딩 핑크 톤업(무기자차 톤업)
     실외 3시간+ → 닥터지 그린 마일드 업 선스틱(덧바르기 팁) */
  '라운드랩 자작나무 수분 선크림':
    { price:22000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'매일 쓰는 수분 선크림. 커머디티 처방이라 이 가격이면 충분해요.',
      tier:'commodity', texture:'light', sunscreen_filter:'hybrid', sensitive_safe:true },
  '닥터지 그린 마일드 업 선 플러스':
    { price:19900, oyUrl:'', verdict:'BEST_VALUE', priceReason:'무기자차 민감 선크림 스테디셀러(올영 어워즈). 순한데 백탁이 적어요.',
      tier:'commodity', texture:'light', sunscreen_filter:'inorganic', whitecast:'low', sensitive_safe:true, emergency_safe:true },
  '메이크프렘 수딩 핑크 톤업 선크림':
    { price:20000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'무기자차 톤업 선크림. 파데 없이 이것만 발라도 화사해요.',
      tier:'commodity', texture:'light', sunscreen_filter:'inorganic', toneup:true, sensitive_safe:true },
  '닥터지 그린 마일드 업 선스틱':
    { price:16000, oyUrl:'', verdict:'BEST_VALUE', priceReason:'덧바르기용 무기자차 스틱. 화장 위에도 발려요.',
      tier:'commodity', texture:'light', sunscreen_filter:'inorganic', sensitive_safe:true },

  /* ── PIE(붉은 자국) 진정 / 액티브 대체(PHA·BHA 대신) ───────────────
     붉은 여드름 자국은 미백이 아니라 진정. PHA는 BHA 불내성 대체로도 씀 */
  '에스트라 에이시카365 흔적진정세럼':
    { price:27000, oyUrl:'', verdict:'FORMULATION_VALUE', priceReason:'PHA로 순하게 각질 정리 + 시카 진정. 붉은 자국(PIE)·BHA 대체에 좋아요.',
      tier:'commodity', texture:'light', active_type:'pha', sensitive_safe:true }

};
