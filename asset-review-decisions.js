/* 2026-09-25 visual review decisions.
 * rejected 항목은 잘못된 제품·세트·배너·미니어처이므로 공개하지 않는다.
 * candidate 상태는 추가 확인 전까지 텍스트/실루엣 폴백을 유지한다.
 */
(function(){
  var data=window.SSA_CRAWLED_ASSETS||{products:{},brands:{}};
  var approvedProducts=[8,10,12,15,16,24,32,36,55];
  var rejectedProducts=[6,7,11,19,20,25,26,41];
  var approvedBrands=['cnp-laboratory','cell-fusion-c','paulas-choice','round-lab','the-ordinary','whipped','beplain','celimax','medicube','benton'];
  var rejectedBrands=['aestura','cosrx','torriden','eucerin','make-prem'];
  approvedProducts.forEach(function(id){if(data.products[id])data.products[id].image_status='verified_official';});
  rejectedProducts.forEach(function(id){if(data.products[id])data.products[id].image_status='rejected';});
  approvedBrands.forEach(function(key){if(data.brands[key])data.brands[key].asset_status='verified_official';});
  rejectedBrands.forEach(function(key){if(data.brands[key])data.brands[key].asset_status='rejected';});
  var catalog=window.SSA_ASSET_CATALOG||{};
  Object.keys(data.brands||{}).forEach(function(key){Object.assign((catalog.brands||{})[key]||{},data.brands[key]);});
  (window.KR_PRODUCT_LIST||[]).forEach(function(p){if(data.products[p.id])Object.assign(p,data.products[p.id]);});
  window.SSA_ASSET_REVIEW={approved_products:approvedProducts,rejected_products:rejectedProducts,approved_brands:approvedBrands,rejected_brands:rejectedBrands,reviewed_at:'2026-09-25'};
})();
