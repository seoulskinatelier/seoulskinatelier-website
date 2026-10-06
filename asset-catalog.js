/* SSA image asset catalog.
 * 이미지 파일 자체와 출처 메타데이터를 분리해 교체·검증하기 쉽게 관리한다.
 * tools/crawl-official-assets.mjs 실행 후 generated entries가 이 파일에 병합된다.
 */
(function(){
  var aliases={
    '닥터지':'dr-g','Dr.G':'dr-g','스킨1004':'skin1004','SKIN1004':'skin1004',
    '라로슈포제':'la-roche-posay','유세린':'eucerin','벤튼':'benton','온그리디언츠':'ongredients',
    'AESTURA':'aestura','Bioderma':'bioderma','CNP Laboratory':'cnp-laboratory','COSRX':'cosrx',
    'Cell Fusion C':'cell-fusion-c','Derma Factory':'derma-factory','Goodal':'goodal','ILLIYOON':'illiyoon',
    'IOPE':'iope','Mamonde':'mamonde','Papa Recipe':'papa-recipe','Paula’s Choice':'paulas-choice',
    'ROUND LAB':'round-lab','S.NATURE':'s-nature','The Ordinary':'the-ordinary','Torriden':'torriden',
    'VANCOR':'vancor','VT':'vt','WHIPPED':'whipped','ZEROID':'zeroid','beplain':'beplain','celimax':'celimax',
    'innisfree':'innisfree','make p:rem':'make-prem','medicube':'medicube','numbuzin':'numbuzin','식물나라':'shingmulnara'
  };
  var brands={
    'aestura':{name:'AESTURA',official_site_url:'https://www.aestura.com/'},
    'bioderma':{name:'BIODERMA',official_site_url:'https://www.bioderma.com/'},
    'cnp-laboratory':{name:'CNP Laboratory',official_site_url:'https://cnpmall.com/'},
    'cosrx':{name:'COSRX',official_site_url:'https://www.cosrx.co.kr/'},
    'cell-fusion-c':{name:'Cell Fusion C',official_site_url:'https://www.cellfusionc.co.kr/'},
    'derma-factory':{name:'Derma Factory',official_site_url:'https://dermafactory.co.kr/'},
    'dr-g':{name:'Dr.G',official_site_url:'https://www.dr-g.co.kr/'},
    'goodal':{name:'Goodal',official_site_url:'https://clubclio.co.kr/goodal/'},
    'illiyoon':{name:'ILLIYOON',official_site_url:'https://illiyoon.com/'},
    'iope':{name:'IOPE',official_site_url:'https://www.iope.com/kr/ko/'},
    'mamonde':{name:'Mamonde',official_site_url:'https://www.mamonde.com/kr/ko/'},
    'papa-recipe':{name:'Papa Recipe',official_site_url:'https://paparecipe.com/'},
    'paulas-choice':{name:"Paula's Choice",official_site_url:'https://www.paulaschoice.co.kr/'},
    'round-lab':{name:'ROUND LAB',official_site_url:'https://roundlab.co.kr/'},
    's-nature':{name:'S.NATURE',official_site_url:'https://snature.co.kr/'},
    'skin1004':{name:'SKIN1004',official_site_url:'https://skin1004korea.com/'},
    'the-ordinary':{name:'The Ordinary',official_site_url:'https://theordinary.com/'},
    'torriden':{name:'Torriden',official_site_url:'https://www.torriden.com/'},
    'vancor':{name:'VANCOR',official_site_url:'https://vancor.co.kr/'},
    'vt':{name:'VT',official_site_url:'https://vt-cosmetics.com/'},
    'whipped':{name:'WHIPPED',official_site_url:'https://whipped.co.kr/'},
    'zeroid':{name:'ZEROID',official_site_url:'https://www.zeroid.co.kr/'},
    'beplain':{name:'beplain',official_site_url:'https://beplain.co.kr/'},
    'celimax':{name:'celimax',official_site_url:'https://celimax.co.kr/'},
    'innisfree':{name:'innisfree',official_site_url:'https://www.innisfree.com/kr/ko/'},
    'make-prem':{name:'make p:rem',official_site_url:'https://makeprem.com/'},
    'medicube':{name:'medicube',official_site_url:'https://themedicube.co.kr/'},
    'numbuzin':{name:'numbuzin',official_site_url:'https://numbuzin.com/'},
    'la-roche-posay':{name:'La Roche-Posay',official_site_url:'https://www.larocheposay.co.kr/'},
    'benton':{name:'Benton',official_site_url:'https://bentoncosmetic.com/'},
    'shingmulnara':{name:'식물나라',official_site_url:'https://www.oliveyoung.co.kr/'},
    'ongredients':{name:'ongredients',official_site_url:'https://ongredients.com/'},
    'eucerin':{name:'Eucerin',official_site_url:'https://www.eucerin.co.kr/'}
  };
  Object.keys(brands).forEach(function(key){
    brands[key].key=key;
    brands[key].logo_url='assets/brands/'+key+'.svg';
    brands[key].logo_source_url=brands[key].official_site_url;
    brands[key].asset_status='pending_official_crawl';
  });
  window.SSA_ASSET_CATALOG={brandAliases:aliases,brands:brands,updated_at:'2026-09-25'};
  (window.KR_PRODUCT_LIST||[]).forEach(function(product){
    var brandKey=aliases[product.brand]||String(product.brand||'unknown').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    product.brand_key=brandKey;
    product.image_url='assets/products/'+String(product.id).padStart(3,'0')+'.webp';
    product.image_source_url=product.product_url||product.ingredient_source_url||null;
    product.image_status='pending_official_crawl';
    product.logo_url=(brands[brandKey]||{}).logo_url||null;
  });
})();
