const MAP_NAMES = [
    {
        "name": "World",
        "url": "https://simplemaps.com/static/demos/resources/svg-library/svgs/world.svg",
        "id": "World"
    },
    {
        "name": "Europe",
        "url": "https://simplemaps.com/static/demos/resources//svg-library/svgs/europe.svg",
        "id": "Europe"
    },
    {
        "name": "Africa",
        "url": "https://simplemaps.com/static/demos/resources//svg-library/svgs/africa.svg",
        "id": "Africa"
    },
    {
        "name": "North America",
        "url": "https://simplemaps.com/static/demos/resources//svg-library/svgs/north-america.svg",
        "id": "NorthAmerica"
    },
    {
        "name": "United States",
        "url": "https://simplemaps.com/static/demos/resources/svg-library/svgs/us.svg",
        "id": "UnitedStates"
    },
    {
        "name": "Afghanistan",
        "url": "https://simplemaps.com/static/svg/af/af.svg",
        "id": "Afghanistan"
    },
    {
        "name": "Albania",
        "url": "https://simplemaps.com/static/svg/al/al.svg",
        "id": "Albania"
    },
    {
        "name": "Algeria",
        "url": "https://simplemaps.com/static/svg/dz/dz.svg",
        "id": "Algeria"
    },
    {
        "name": "Andorra",
        "url": "https://simplemaps.com/static/svg/ad/ad.svg",
        "id": "Andorra"
    },
    {
        "name": "Angola",
        "url": "https://simplemaps.com/static/svg/ao/ao.svg",
        "id": "Angola"
    },
    {
        "name": "Anguilla",
        "url": "https://simplemaps.com/static/svg/ai/ai.svg",
        "id": "Anguilla"
    },
    {
        "name": "Antigua and Barbuda",
        "url": "https://simplemaps.com/static/svg/ag/ag.svg",
        "id": "Antiguaand Barbuda"
    },
    {
        "name": "Argentina",
        "url": "https://simplemaps.com/static/svg/ar/ar.svg",
        "id": "Argentina"
    },
    {
        "name": "Armenia",
        "url": "https://simplemaps.com/static/svg/am/am.svg",
        "id": "Armenia"
    },
    {
        "name": "Aruba",
        "url": "https://simplemaps.com/static/svg/aw/aw.svg",
        "id": "Aruba"
    },
    {
        "name": "Australia",
        "url": "https://simplemaps.com/static/svg/au/au.svg",
        "id": "Australia"
    },
    {
        "name": "Austria",
        "url": "https://simplemaps.com/static/svg/at/at.svg",
        "id": "Austria"
    },
    {
        "name": "Azerbaijan",
        "url": "https://simplemaps.com/static/svg/az/az.svg",
        "id": "Azerbaijan"
    },
    {
        "name": "Bahamas",
        "url": "https://simplemaps.com/static/svg/bs/bs.svg",
        "id": "Bahamas"
    },
    {
        "name": "Bahrain",
        "url": "https://simplemaps.com/static/svg/bh/bh.svg",
        "id": "Bahrain"
    },
    {
        "name": "Bangladesh",
        "url": "https://simplemaps.com/static/svg/bd/bd.svg",
        "id": "Bangladesh"
    },
    {
        "name": "Barbados",
        "url": "https://simplemaps.com/static/svg/bb/bb.svg",
        "id": "Barbados"
    },
    {
        "name": "Belarus",
        "url": "https://simplemaps.com/static/svg/by/by.svg",
        "id": "Belarus"
    },
    {
        "name": "Belgium",
        "url": "https://simplemaps.com/static/svg/be/be.svg",
        "id": "Belgium"
    },
    {
        "name": "Belize",
        "url": "https://simplemaps.com/static/svg/bz/bz.svg",
        "id": "Belize"
    },
    {
        "name": "Benin",
        "url": "https://simplemaps.com/static/svg/bj/bj.svg",
        "id": "Benin"
    },
    {
        "name": "Bermuda",
        "url": "https://simplemaps.com/static/svg/bm/bm.svg",
        "id": "Bermuda"
    },
    {
        "name": "Bhutan",
        "url": "https://simplemaps.com/static/svg/bt/bt.svg",
        "id": "Bhutan"
    },
    {
        "name": "Bolivia",
        "url": "https://simplemaps.com/static/svg/bo/bo.svg",
        "id": "Bolivia"
    },
    {
        "name": "Bosnia and Herzegovina",
        "url": "https://simplemaps.com/static/svg/ba/ba.svg",
        "id": "Bosniaand Herzegovina"
    },
    {
        "name": "Botswana",
        "url": "https://simplemaps.com/static/svg/bw/bw.svg",
        "id": "Botswana"
    },
    {
        "name": "Brazil",
        "url": "https://simplemaps.com/static/svg/br/br.svg",
        "id": "Brazil"
    },
    {
        "name": "British Virgin Islands",
        "url": "https://simplemaps.com/static/svg/vg/vg.svg",
        "id": "BritishVirgin Islands"
    },
    {
        "name": "Brunei",
        "url": "https://simplemaps.com/static/svg/bn/bn.svg",
        "id": "Brunei"
    },
    {
        "name": "Bulgaria",
        "url": "https://simplemaps.com/static/svg/bg/bg.svg",
        "id": "Bulgaria"
    },
    {
        "name": "Burkina Faso",
        "url": "https://simplemaps.com/static/svg/bf/bf.svg",
        "id": "BurkinaFaso"
    },
    {
        "name": "Burundi",
        "url": "https://simplemaps.com/static/svg/bi/bi.svg",
        "id": "Burundi"
    },
    {
        "name": "Cambodia",
        "url": "https://simplemaps.com/static/svg/kh/kh.svg",
        "id": "Cambodia"
    },
    {
        "name": "Cameroon",
        "url": "https://simplemaps.com/static/svg/cm/cm.svg",
        "id": "Cameroon"
    },
    {
        "name": "Canada",
        "url": "https://simplemaps.com/static/svg/ca/ca.svg",
        "id": "Canada"
    },
    {
        "name": "Cape Verde",
        "url": "https://simplemaps.com/static/svg/cv/cv.svg",
        "id": "CapeVerde"
    },
    {
        "name": "Cayman Islands",
        "url": "https://simplemaps.com/static/svg/ky/ky.svg",
        "id": "CaymanIslands"
    },
    {
        "name": "Central African Republic",
        "url": "https://simplemaps.com/static/svg/cf/cf.svg",
        "id": "CentralAfrican Republic"
    },
    {
        "name": "Chad",
        "url": "https://simplemaps.com/static/svg/td/td.svg",
        "id": "Chad"
    },
    {
        "name": "Chile",
        "url": "https://simplemaps.com/static/svg/cl/cl.svg",
        "id": "Chile"
    },
    {
        "name": "China",
        "url": "https://simplemaps.com/static/svg/cn/cn.svg",
        "id": "China"
    },
    {
        "name": "Colombia",
        "url": "https://simplemaps.com/static/svg/co/co.svg",
        "id": "Colombia"
    },
    {
        "name": "Comoros",
        "url": "https://simplemaps.com/static/svg/km/km.svg",
        "id": "Comoros"
    },
    {
        "name": "Costa Rica",
        "url": "https://simplemaps.com/static/svg/cr/cr.svg",
        "id": "CostaRica"
    },
    {
        "name": "Croatia",
        "url": "https://simplemaps.com/static/svg/hr/hr.svg",
        "id": "Croatia"
    },
    {
        "name": "Cuba",
        "url": "https://simplemaps.com/static/svg/cu/cu.svg",
        "id": "Cuba"
    },
    {
        "name": "Curaco (Netherlands)",
        "url": "https://simplemaps.com/static/svg/cw/cw.svg",
        "id": "Curaco(Netherlands)"
    },
    {
        "name": "Cyprus",
        "url": "https://simplemaps.com/static/svg/cy/cy.svg",
        "id": "Cyprus"
    },
    {
        "name": "Czech Republic",
        "url": "https://simplemaps.com/static/svg/cz/cz.svg",
        "id": "CzechRepublic"
    },
    {
        "name": "Côte d'Ivoire",
        "url": "https://simplemaps.com/static/svg/ci/ci.svg",
        "id": "Côted'Ivoire"
    },
    {
        "name": "Democratic Republic of the Congo",
        "url": "https://simplemaps.com/static/svg/cd/cd.svg",
        "id": "DemocraticRepublic of the Congo"
    },
    {
        "name": "Denmark",
        "url": "https://simplemaps.com/static/svg/dk/dk.svg",
        "id": "Denmark"
    },
    {
        "name": "Djibouti",
        "url": "https://simplemaps.com/static/svg/dj/dj.svg",
        "id": "Djibouti"
    },
    {
        "name": "Dominica",
        "url": "https://simplemaps.com/static/svg/dm/dm.svg",
        "id": "Dominica"
    },
    {
        "name": "Dominican Republic",
        "url": "https://simplemaps.com/static/svg/do/do.svg",
        "id": "DominicanRepublic"
    },
    {
        "name": "Ecuador",
        "url": "https://simplemaps.com/static/svg/ec/ec.svg",
        "id": "Ecuador"
    },
    {
        "name": "Egypt",
        "url": "https://simplemaps.com/static/svg/eg/eg.svg",
        "id": "Egypt"
    },
    {
        "name": "El Salvador",
        "url": "https://simplemaps.com/static/svg/sv/sv.svg",
        "id": "ElSalvador"
    },
    {
        "name": "Equatorial Guinea",
        "url": "https://simplemaps.com/static/svg/gq/gq.svg",
        "id": "EquatorialGuinea"
    },
    {
        "name": "Eritrea",
        "url": "https://simplemaps.com/static/svg/er/er.svg",
        "id": "Eritrea"
    },
    {
        "name": "Estonia",
        "url": "https://simplemaps.com/static/svg/ee/ee.svg",
        "id": "Estonia"
    },
    {
        "name": "Ethiopia",
        "url": "https://simplemaps.com/static/svg/et/et.svg",
        "id": "Ethiopia"
    },
    {
        "name": "Faeroe Islands",
        "url": "https://simplemaps.com/static/svg/fo/fo.svg",
        "id": "FaeroeIslands"
    },
    {
        "name": "Falkland Islands",
        "url": "https://simplemaps.com/static/svg/fk/fk.svg",
        "id": "FalklandIslands"
    },
    {
        "name": "Fiji",
        "url": "https://simplemaps.com/static/svg/fj/fj.svg",
        "id": "Fiji"
    },
    {
        "name": "Finland",
        "url": "https://simplemaps.com/static/svg/fi/fi.svg",
        "id": "Finland"
    },
    {
        "name": "France",
        "url": "https://simplemaps.com/static/svg/fr/fr.svg",
        "id": "France"
    },
    {
        "name": "French Polynesia",
        "url": "https://simplemaps.com/static/svg/pf/pf.svg",
        "id": "FrenchPolynesia"
    },
    {
        "name": "Gabon",
        "url": "https://simplemaps.com/static/svg/ga/ga.svg",
        "id": "Gabon"
    },
    {
        "name": "Georgia",
        "url": "https://simplemaps.com/static/svg/ge/ge.svg",
        "id": "Georgia"
    },
    {
        "name": "Germany",
        "url": "https://simplemaps.com/static/svg/de/de.svg",
        "id": "Germany"
    },
    {
        "name": "Ghana",
        "url": "https://simplemaps.com/static/svg/gh/gh.svg",
        "id": "Ghana"
    },
    {
        "name": "Greece",
        "url": "https://simplemaps.com/static/svg/gr/gr.svg",
        "id": "Greece"
    },
    {
        "name": "Greenland",
        "url": "https://simplemaps.com/static/svg/gl/gl.svg",
        "id": "Greenland"
    },
    {
        "name": "Grenada",
        "url": "https://simplemaps.com/static/svg/gd/gd.svg",
        "id": "Grenada"
    },
    {
        "name": "Guatemala",
        "url": "https://simplemaps.com/static/svg/gt/gt.svg",
        "id": "Guatemala"
    },
    {
        "name": "Guinea",
        "url": "https://simplemaps.com/static/svg/gn/gn.svg",
        "id": "Guinea"
    },
    {
        "name": "Guinea-Bissau",
        "url": "https://simplemaps.com/static/svg/gw/gw.svg",
        "id": "Guinea-Bissau"
    },
    {
        "name": "Guyana",
        "url": "https://simplemaps.com/static/svg/gy/gy.svg",
        "id": "Guyana"
    },
    {
        "name": "Haiti",
        "url": "https://simplemaps.com/static/svg/ht/ht.svg",
        "id": "Haiti"
    },
    {
        "name": "Honduras",
        "url": "https://simplemaps.com/static/svg/hn/hn.svg",
        "id": "Honduras"
    },
    {
        "name": "Hong Kong",
        "url": "https://simplemaps.com/static/svg/hk/hk.svg",
        "id": "HongKong"
    },
    {
        "name": "Hungary",
        "url": "https://simplemaps.com/static/svg/hu/hu.svg",
        "id": "Hungary"
    },
    {
        "name": "Iceland",
        "url": "https://simplemaps.com/static/svg/is/is.svg",
        "id": "Iceland"
    },
    {
        "name": "India",
        "url": "https://simplemaps.com/static/svg/in/in.svg",
        "id": "India"
    },
    {
        "name": "Indonesia",
        "url": "https://simplemaps.com/static/svg/id/id.svg",
        "id": "Indonesia"
    },
    {
        "name": "Iran",
        "url": "https://simplemaps.com/static/svg/ir/ir.svg",
        "id": "Iran"
    },
    {
        "name": "Iraq",
        "url": "https://simplemaps.com/static/svg/iq/iq.svg",
        "id": "Iraq"
    },
    {
        "name": "Ireland",
        "url": "https://simplemaps.com/static/svg/ie/ie.svg",
        "id": "Ireland"
    },
    {
        "name": "Israel",
        "url": "https://simplemaps.com/static/svg/il/il.svg",
        "id": "Israel"
    },
    {
        "name": "Italy",
        "url": "https://simplemaps.com/static/svg/it/it.svg",
        "id": "Italy"
    },
    {
        "name": "Jamaica",
        "url": "https://simplemaps.com/static/svg/jm/jm.svg",
        "id": "Jamaica"
    },
    {
        "name": "Japan",
        "url": "https://simplemaps.com/static/svg/jp/jp.svg",
        "id": "Japan"
    },
    {
        "name": "Jordan",
        "url": "https://simplemaps.com/static/svg/jo/jo.svg",
        "id": "Jordan"
    },
    {
        "name": "Kazakhstan",
        "url": "https://simplemaps.com/static/svg/kz/kz.svg",
        "id": "Kazakhstan"
    },
    {
        "name": "Kenya",
        "url": "https://simplemaps.com/static/svg/ke/ke.svg",
        "id": "Kenya"
    },
    {
        "name": "Kuwait",
        "url": "https://simplemaps.com/static/svg/kw/kw.svg",
        "id": "Kuwait"
    },
    {
        "name": "Kyrgyzstan",
        "url": "https://simplemaps.com/static/svg/kg/kg.svg",
        "id": "Kyrgyzstan"
    },
    {
        "name": "Laos",
        "url": "https://simplemaps.com/static/svg/la/la.svg",
        "id": "Laos"
    },
    {
        "name": "Latvia",
        "url": "https://simplemaps.com/static/svg/lv/lv.svg",
        "id": "Latvia"
    },
    {
        "name": "Lebanon",
        "url": "https://simplemaps.com/static/svg/lb/lb.svg",
        "id": "Lebanon"
    },
    {
        "name": "Lesotho",
        "url": "https://simplemaps.com/static/svg/ls/ls.svg",
        "id": "Lesotho"
    },
    {
        "name": "Liberia",
        "url": "https://simplemaps.com/static/svg/lr/lr.svg",
        "id": "Liberia"
    },
    {
        "name": "Libya",
        "url": "https://simplemaps.com/static/svg/ly/ly.svg",
        "id": "Libya"
    },
    {
        "name": "Liechtenstein",
        "url": "https://simplemaps.com/static/svg/li/li.svg",
        "id": "Liechtenstein"
    },
    {
        "name": "Lithuania",
        "url": "https://simplemaps.com/static/svg/lt/lt.svg",
        "id": "Lithuania"
    },
    {
        "name": "Luxembourg",
        "url": "https://simplemaps.com/static/svg/lu/lu.svg",
        "id": "Luxembourg"
    },
    {
        "name": "Macedonia",
        "url": "https://simplemaps.com/static/svg/mk/mk.svg",
        "id": "Macedonia"
    },
    {
        "name": "Madagascar",
        "url": "https://simplemaps.com/static/svg/mg/mg.svg",
        "id": "Madagascar"
    },
    {
        "name": "Malawi",
        "url": "https://simplemaps.com/static/svg/mw/mw.svg",
        "id": "Malawi"
    },
    {
        "name": "Malaysia",
        "url": "https://simplemaps.com/static/svg/my/my.svg",
        "id": "Malaysia"
    },
    {
        "name": "Maldives",
        "url": "https://simplemaps.com/static/svg/mv/mv.svg",
        "id": "Maldives"
    },
    {
        "name": "Mali",
        "url": "https://simplemaps.com/static/svg/ml/ml.svg",
        "id": "Mali"
    },
    {
        "name": "Malta",
        "url": "https://simplemaps.com/static/svg/mt/mt.svg",
        "id": "Malta"
    },
    {
        "name": "Mauritania",
        "url": "https://simplemaps.com/static/svg/mr/mr.svg",
        "id": "Mauritania"
    },
    {
        "name": "Mauritius",
        "url": "https://simplemaps.com/static/svg/mu/mu.svg",
        "id": "Mauritius"
    },
    {
        "name": "Mexico",
        "url": "https://simplemaps.com/static/svg/mx/mx.svg",
        "id": "Mexico"
    },
    {
        "name": "Moldova",
        "url": "https://simplemaps.com/static/svg/md/md.svg",
        "id": "Moldova"
    },
    {
        "name": "Mongolia",
        "url": "https://simplemaps.com/static/svg/mn/mn.svg",
        "id": "Mongolia"
    },
    {
        "name": "Montenegro",
        "url": "https://simplemaps.com/static/svg/me/me.svg",
        "id": "Montenegro"
    },
    {
        "name": "Montserrat",
        "url": "https://simplemaps.com/static/svg/ms/ms.svg",
        "id": "Montserrat"
    },
    {
        "name": "Morocco",
        "url": "https://simplemaps.com/static/svg/ma/ma.svg",
        "id": "Morocco"
    },
    {
        "name": "Mozambique",
        "url": "https://simplemaps.com/static/svg/mz/mz.svg",
        "id": "Mozambique"
    },
    {
        "name": "Myanmar",
        "url": "https://simplemaps.com/static/svg/mm/mm.svg",
        "id": "Myanmar"
    },
    {
        "name": "Namibia",
        "url": "https://simplemaps.com/static/svg/na/na.svg",
        "id": "Namibia"
    },
    {
        "name": "Nauru",
        "url": "https://simplemaps.com/static/svg/nr/nr.svg",
        "id": "Nauru"
    },
    {
        "name": "Nepal",
        "url": "https://simplemaps.com/static/svg/np/np.svg",
        "id": "Nepal"
    },
    {
        "name": "Netherlands",
        "url": "https://simplemaps.com/static/svg/nl/nl.svg",
        "id": "Netherlands"
    },
    {
        "name": "New Caledonia",
        "url": "https://simplemaps.com/static/svg/nc/nc.svg",
        "id": "NewCaledonia"
    },
    {
        "name": "New Zealand",
        "url": "https://simplemaps.com/static/svg/nz/nz.svg",
        "id": "NewZealand"
    },
    {
        "name": "Nicaragua",
        "url": "https://simplemaps.com/static/svg/ni/ni.svg",
        "id": "Nicaragua"
    },
    {
        "name": "Niger",
        "url": "https://simplemaps.com/static/svg/ne/ne.svg",
        "id": "Niger"
    },
    {
        "name": "Nigeria",
        "url": "https://simplemaps.com/static/svg/ng/ng.svg",
        "id": "Nigeria"
    },
    {
        "name": "North Korea",
        "url": "https://simplemaps.com/static/svg/kp/kp.svg",
        "id": "NorthKorea"
    },
    {
        "name": "Norway",
        "url": "https://simplemaps.com/static/svg/no/no.svg",
        "id": "Norway"
    },
    {
        "name": "Oman",
        "url": "https://simplemaps.com/static/svg/om/om.svg",
        "id": "Oman"
    },
    {
        "name": "Pakistan",
        "url": "https://simplemaps.com/static/svg/pk/pk.svg",
        "id": "Pakistan"
    },
    {
        "name": "Palestine",
        "url": "https://simplemaps.com/static/svg/ps/ps.svg",
        "id": "Palestine"
    },
    {
        "name": "Panama",
        "url": "https://simplemaps.com/static/svg/pa/pa.svg",
        "id": "Panama"
    },
    {
        "name": "Papua New Guinea",
        "url": "https://simplemaps.com/static/svg/pg/pg.svg",
        "id": "PapuaNew Guinea"
    },
    {
        "name": "Paraguay",
        "url": "https://simplemaps.com/static/svg/py/py.svg",
        "id": "Paraguay"
    },
    {
        "name": "Peru",
        "url": "https://simplemaps.com/static/svg/pe/pe.svg",
        "id": "Peru"
    },
    {
        "name": "Philippines",
        "url": "https://simplemaps.com/static/svg/ph/ph.svg",
        "id": "Philippines"
    },
    {
        "name": "Pitcairn Islands",
        "url": "https://simplemaps.com/static/svg/pn/pn.svg",
        "id": "PitcairnIslands"
    },
    {
        "name": "Poland",
        "url": "https://simplemaps.com/static/svg/pl/pl.svg",
        "id": "Poland"
    },
    {
        "name": "Portugal",
        "url": "https://simplemaps.com/static/svg/pt/pt.svg",
        "id": "Portugal"
    },
    {
        "name": "Puerto Rico",
        "url": "https://simplemaps.com/static/svg/pr/pr.svg",
        "id": "PuertoRico"
    },
    {
        "name": "Qatar",
        "url": "https://simplemaps.com/static/svg/qa/qa.svg",
        "id": "Qatar"
    },
    {
        "name": "Republic of Congo",
        "url": "https://simplemaps.com/static/svg/cg/cg.svg",
        "id": "Republicof Congo"
    },
    {
        "name": "Romania",
        "url": "https://simplemaps.com/static/svg/ro/ro.svg",
        "id": "Romania"
    },
    {
        "name": "Russian Federation",
        "url": "https://simplemaps.com/static/svg/ru/ru.svg",
        "id": "RussianFederation"
    },
    {
        "name": "Rwanda",
        "url": "https://simplemaps.com/static/svg/rw/rw.svg",
        "id": "Rwanda"
    },
    {
        "name": "Saint Kitts and Nevis",
        "url": "https://simplemaps.com/static/svg/kn/kn.svg",
        "id": "SaintKitts and Nevis"
    },
    {
        "name": "Saint Lucia",
        "url": "https://simplemaps.com/static/svg/lc/lc.svg",
        "id": "SaintLucia"
    },
    {
        "name": "Saint Martin (Dutch)",
        "url": "https://simplemaps.com/static/svg/sx/sx.svg",
        "id": "SaintMartin (Dutch)"
    },
    {
        "name": "Saint Martin (French)",
        "url": "https://simplemaps.com/static/svg/mf/mf.svg",
        "id": "SaintMartin (French)"
    },
    {
        "name": "Saint Vincent and the Grenadines",
        "url": "https://simplemaps.com/static/svg/vc/vc.svg",
        "id": "SaintVincent and the Grenadines"
    },
    {
        "name": "Saudi Arabia",
        "url": "https://simplemaps.com/static/svg/sa/sa.svg",
        "id": "SaudiArabia"
    },
    {
        "name": "Senegal",
        "url": "https://simplemaps.com/static/svg/sn/sn.svg",
        "id": "Senegal"
    },
    {
        "name": "Serbia",
        "url": "https://simplemaps.com/static/svg/rs/rs.svg",
        "id": "Serbia"
    },
    {
        "name": "Seychelles",
        "url": "https://simplemaps.com/static/svg/sc/sc.svg",
        "id": "Seychelles"
    },
    {
        "name": "Sierra Leone",
        "url": "https://simplemaps.com/static/svg/sl/sl.svg",
        "id": "SierraLeone"
    },
    {
        "name": "Singapore",
        "url": "https://simplemaps.com/static/svg/sg/sg.svg",
        "id": "Singapore"
    },
    {
        "name": "Slovakia",
        "url": "https://simplemaps.com/static/svg/sk/sk.svg",
        "id": "Slovakia"
    },
    {
        "name": "Slovenia",
        "url": "https://simplemaps.com/static/svg/si/si.svg",
        "id": "Slovenia"
    },
    {
        "name": "Solomon Islands",
        "url": "https://simplemaps.com/static/svg/sb/sb.svg",
        "id": "SolomonIslands"
    },
    {
        "name": "Somalia",
        "url": "https://simplemaps.com/static/svg/so/so.svg",
        "id": "Somalia"
    },
    {
        "name": "South Africa",
        "url": "https://simplemaps.com/static/svg/za/za.svg",
        "id": "SouthAfrica"
    },
    {
        "name": "South Korea",
        "url": "https://simplemaps.com/static/svg/kr/kr.svg",
        "id": "SouthKorea"
    },
    {
        "name": "South Sudan",
        "url": "https://simplemaps.com/static/svg/ss/ss.svg",
        "id": "SouthSudan"
    },
    {
        "name": "Spain",
        "url": "https://simplemaps.com/static/svg/es/es.svg",
        "id": "Spain"
    },
    {
        "name": "Sri Lanka",
        "url": "https://simplemaps.com/static/svg/lk/lk.svg",
        "id": "SriLanka"
    },
    {
        "name": "Sudan",
        "url": "https://simplemaps.com/static/svg/sd/sd.svg",
        "id": "Sudan"
    },
    {
        "name": "Suriname",
        "url": "https://simplemaps.com/static/svg/sr/sr.svg",
        "id": "Suriname"
    },
    {
        "name": "Swaziland",
        "url": "https://simplemaps.com/static/svg/sz/sz.svg",
        "id": "Swaziland"
    },
    {
        "name": "Sweden",
        "url": "https://simplemaps.com/static/svg/se/se.svg",
        "id": "Sweden"
    },
    {
        "name": "Switzerland",
        "url": "https://simplemaps.com/static/svg/ch/ch.svg",
        "id": "Switzerland"
    },
    {
        "name": "Syria",
        "url": "https://simplemaps.com/static/svg/sy/sy.svg",
        "id": "Syria"
    },
    {
        "name": "São Tomé and Principe",
        "url": "https://simplemaps.com/static/svg/st/st.svg",
        "id": "SãoTomé and Principe"
    },
    {
        "name": "Taiwan",
        "url": "https://simplemaps.com/static/svg/tw/tw.svg",
        "id": "Taiwan"
    },
    {
        "name": "Tajikistan",
        "url": "https://simplemaps.com/static/svg/tj/tj.svg",
        "id": "Tajikistan"
    },
    {
        "name": "Tanzania",
        "url": "https://simplemaps.com/static/svg/tz/tz.svg",
        "id": "Tanzania"
    },
    {
        "name": "Thailand",
        "url": "https://simplemaps.com/static/svg/th/th.svg",
        "id": "Thailand"
    },
    {
        "name": "The Gambia",
        "url": "https://simplemaps.com/static/svg/gm/gm.svg",
        "id": "TheGambia"
    },
    {
        "name": "Timor-Leste",
        "url": "https://simplemaps.com/static/svg/tl/tl.svg",
        "id": "Timor-Leste"
    },
    {
        "name": "Togo",
        "url": "https://simplemaps.com/static/svg/tg/tg.svg",
        "id": "Togo"
    },
    {
        "name": "Tonga",
        "url": "https://simplemaps.com/static/svg/to/to.svg",
        "id": "Tonga"
    },
    {
        "name": "Trinidad and Tobago",
        "url": "https://simplemaps.com/static/svg/tt/tt.svg",
        "id": "Trinidadand Tobago"
    },
    {
        "name": "Tunisia",
        "url": "https://simplemaps.com/static/svg/tn/tn.svg",
        "id": "Tunisia"
    },
    {
        "name": "Turkey",
        "url": "https://simplemaps.com/static/svg/tr/tr.svg",
        "id": "Turkey"
    },
    {
        "name": "Turkmenistan",
        "url": "https://simplemaps.com/static/svg/tm/tm.svg",
        "id": "Turkmenistan"
    },
    {
        "name": "Turks and Caicos Islands",
        "url": "https://simplemaps.com/static/svg/tc/tc.svg",
        "id": "Turksand Caicos Islands"
    },
    {
        "name": "Uganda",
        "url": "https://simplemaps.com/static/svg/ug/ug.svg",
        "id": "Uganda"
    },
    {
        "name": "Ukraine",
        "url": "https://simplemaps.com/static/svg/ua/ua.svg",
        "id": "Ukraine"
    },
    {
        "name": "United Arab Emirates",
        "url": "https://simplemaps.com/static/svg/ae/ae.svg",
        "id": "UnitedArab Emirates"
    },
    {
        "name": "United Kingdom",
        "url": "https://simplemaps.com/static/svg/gb/gb.svg",
        "id": "UnitedKingdom"
    },
    {
        "name": "United States Virgin Islands",
        "url": "https://simplemaps.com/static/svg/vi/vi.svg",
        "id": "UnitedStates Virgin Islands"
    },
    {
        "name": "Uruguay",
        "url": "https://simplemaps.com/static/svg/uy/uy.svg",
        "id": "Uruguay"
    },
    {
        "name": "Uzbekistan",
        "url": "https://simplemaps.com/static/svg/uz/uz.svg",
        "id": "Uzbekistan"
    },
    {
        "name": "Vanuatu",
        "url": "https://simplemaps.com/static/svg/vu/vu.svg",
        "id": "Vanuatu"
    },
    {
        "name": "Venezuela",
        "url": "https://simplemaps.com/static/svg/ve/ve.svg",
        "id": "Venezuela"
    },
    {
        "name": "Vietnam",
        "url": "https://simplemaps.com/static/svg/vn/vn.svg",
        "id": "Vietnam"
    },
    {
        "name": "Western Sahara",
        "url": "https://simplemaps.com/static/svg/eh/eh.svg",
        "id": "WesternSahara"
    },
    {
        "name": "Yemen",
        "url": "https://simplemaps.com/static/svg/ye/ye.svg",
        "id": "Yemen"
    },
    {
        "name": "Zambia",
        "url": "https://simplemaps.com/static/svg/zm/zm.svg",
        "id": "Zambia"
    },
    {
        "name": "Zimbabwe",
        "url": "https://simplemaps.com/static/svg/zw/zw.svg",
        "id": "Zimbabwe"
    }
]

const FLAGS = [
    {
        "id": "ad",
        "name": "Andorra"
    },
    {
        "id": "ae",
        "name": "United Arab Emirates"
    },
    {
        "id": "af",
        "name": "Afghanistan"
    },
    {
        "id": "ag",
        "name": "Antigua and Barbuda"
    },
    {
        "id": "ai",
        "name": "Anguilla"
    },
    {
        "id": "al",
        "name": "Albania"
    },
    {
        "id": "am",
        "name": "Armenia"
    },
    {
        "id": "ao",
        "name": "Angola"
    },
    {
        "id": "aq",
        "name": "Antarctica"
    },
    {
        "id": "ar",
        "name": "Argentina"
    },
    {
        "id": "as",
        "name": "American Samoa"
    },
    {
        "id": "at",
        "name": "Austria"
    },
    {
        "id": "au",
        "name": "Australia"
    },
    {
        "id": "aw",
        "name": "Aruba"
    },
    {
        "id": "ax",
        "name": "Åland Islands"
    },
    {
        "id": "az",
        "name": "Azerbaijan"
    },
    {
        "id": "ba",
        "name": "Bosnia and Herzegovina"
    },
    {
        "id": "bb",
        "name": "Barbados"
    },
    {
        "id": "bd",
        "name": "Bangladesh"
    },
    {
        "id": "be",
        "name": "Belgium"
    },
    {
        "id": "bf",
        "name": "Burkina Faso"
    },
    {
        "id": "bg",
        "name": "Bulgaria"
    },
    {
        "id": "bh",
        "name": "Bahrain"
    },
    {
        "id": "bi",
        "name": "Burundi"
    },
    {
        "id": "bj",
        "name": "Benin"
    },
    {
        "id": "bl",
        "name": "Saint Barthélemy"
    },
    {
        "id": "bm",
        "name": "Bermuda"
    },
    {
        "id": "bn",
        "name": "Brunei Darussalam"
    },
    {
        "id": "bo",
        "name": "Bolivia, Plurinational State of"
    },
    {
        "id": "bq",
        "name": "Caribbean Netherlands"
    },
    {
        "id": "br",
        "name": "Brazil"
    },
    {
        "id": "bs",
        "name": "Bahamas"
    },
    {
        "id": "bt",
        "name": "Bhutan"
    },
    {
        "id": "bv",
        "name": "Bouvet Island"
    },
    {
        "id": "bw",
        "name": "Botswana"
    },
    {
        "id": "by",
        "name": "Belarus"
    },
    {
        "id": "bz",
        "name": "Belize"
    },
    {
        "id": "ca",
        "name": "Canada"
    },
    {
        "id": "cc",
        "name": "Cocos (Keeling) Islands"
    },
    {
        "id": "cd",
        "name": "Congo, the Democratic Republic of the"
    },
    {
        "id": "cf",
        "name": "Central African Republic"
    },
    {
        "id": "cg",
        "name": "Republic of the Congo"
    },
    {
        "id": "ch",
        "name": "Switzerland"
    },
    {
        "id": "ci",
        "name": "Côte d'Ivoire"
    },
    {
        "id": "ck",
        "name": "Cook Islands"
    },
    {
        "id": "cl",
        "name": "Chile"
    },
    {
        "id": "cm",
        "name": "Cameroon"
    },
    {
        "id": "cn",
        "name": "China (People's Republic of China)"
    },
    {
        "id": "co",
        "name": "Colombia"
    },
    {
        "id": "cr",
        "name": "Costa Rica"
    },
    {
        "id": "cu",
        "name": "Cuba"
    },
    {
        "id": "cv",
        "name": "Cape Verde"
    },
    {
        "id": "cw",
        "name": "Curaçao"
    },
    {
        "id": "cx",
        "name": "Christmas Island"
    },
    {
        "id": "cy",
        "name": "Cyprus"
    },
    {
        "id": "cz",
        "name": "Czech Republic"
    },
    {
        "id": "de",
        "name": "Germany"
    },
    {
        "id": "dj",
        "name": "Djibouti"
    },
    {
        "id": "dk",
        "name": "Denmark"
    },
    {
        "id": "dm",
        "name": "Dominica"
    },
    {
        "id": "do",
        "name": "Dominican Republic"
    },
    {
        "id": "dz",
        "name": "Algeria"
    },
    {
        "id": "ec",
        "name": "Ecuador"
    },
    {
        "id": "ee",
        "name": "Estonia"
    },
    {
        "id": "eg",
        "name": "Egypt"
    },
    {
        "id": "eh",
        "name": "Western Sahara"
    },
    {
        "id": "er",
        "name": "Eritrea"
    },
    {
        "id": "es",
        "name": "Spain"
    },
    {
        "id": "et",
        "name": "Ethiopia"
    },
    {
        "id": "eu",
        "name": "Europe"
    },
    {
        "id": "fi",
        "name": "Finland"
    },
    {
        "id": "fj",
        "name": "Fiji"
    },
    {
        "id": "fk",
        "name": "Falkland Islands (Malvinas)"
    },
    {
        "id": "fm",
        "name": "Micronesia, Federated States of"
    },
    {
        "id": "fo",
        "name": "Faroe Islands"
    },
    {
        "id": "fr",
        "name": "France"
    },
    {
        "id": "ga",
        "name": "Gabon"
    },
    {
        "id": "gb-eng",
        "name": "England"
    },
    {
        "id": "gb-nir",
        "name": "Northern Ireland"
    },
    {
        "id": "gb-sct",
        "name": "Scotland"
    },
    {
        "id": "gb-wls",
        "name": "Wales"
    },
    {
        "id": "gb",
        "name": "United Kingdom"
    },
    {
        "id": "gd",
        "name": "Grenada"
    },
    {
        "id": "ge",
        "name": "Georgia"
    },
    {
        "id": "gf",
        "name": "French Guiana"
    },
    {
        "id": "gg",
        "name": "Guernsey"
    },
    {
        "id": "gh",
        "name": "Ghana"
    },
    {
        "id": "gi",
        "name": "Gibraltar"
    },
    {
        "id": "gl",
        "name": "Greenland"
    },
    {
        "id": "gm",
        "name": "Gambia"
    },
    {
        "id": "gn",
        "name": "Guinea"
    },
    {
        "id": "gp",
        "name": "Guadeloupe"
    },
    {
        "id": "gq",
        "name": "Equatorial Guinea"
    },
    {
        "id": "gr",
        "name": "Greece"
    },
    {
        "id": "gs",
        "name": "South Georgia and the South Sandwich Islands"
    },
    {
        "id": "gt",
        "name": "Guatemala"
    },
    {
        "id": "gu",
        "name": "Guam"
    },
    {
        "id": "gw",
        "name": "Guinea-Bissau"
    },
    {
        "id": "gy",
        "name": "Guyana"
    },
    {
        "id": "hk",
        "name": "Hong Kong"
    },
    {
        "id": "hm",
        "name": "Heard Island and McDonald Islands"
    },
    {
        "id": "hn",
        "name": "Honduras"
    },
    {
        "id": "hr",
        "name": "Croatia"
    },
    {
        "id": "ht",
        "name": "Haiti"
    },
    {
        "id": "hu",
        "name": "Hungary"
    },
    {
        "id": "id",
        "name": "Indonesia"
    },
    {
        "id": "ie",
        "name": "Ireland"
    },
    {
        "id": "il",
        "name": "Israel"
    },
    {
        "id": "im",
        "name": "Isle of Man"
    },
    {
        "id": "in",
        "name": "India"
    },
    {
        "id": "io",
        "name": "British Indian Ocean Territory"
    },
    {
        "id": "iq",
        "name": "Iraq"
    },
    {
        "id": "ir",
        "name": "Iran, Islamic Republic of"
    },
    {
        "id": "is",
        "name": "Iceland"
    },
    {
        "id": "it",
        "name": "Italy"
    },
    {
        "id": "je",
        "name": "Jersey"
    },
    {
        "id": "jm",
        "name": "Jamaica"
    },
    {
        "id": "jo",
        "name": "Jordan"
    },
    {
        "id": "jp",
        "name": "Japan"
    },
    {
        "id": "ke",
        "name": "Kenya"
    },
    {
        "id": "kg",
        "name": "Kyrgyzstan"
    },
    {
        "id": "kh",
        "name": "Cambodia"
    },
    {
        "id": "ki",
        "name": "Kiribati"
    },
    {
        "id": "km",
        "name": "Comoros"
    },
    {
        "id": "kn",
        "name": "Saint Kitts and Nevis"
    },
    {
        "id": "kp",
        "name": "Korea, Democratic People's Republic of"
    },
    {
        "id": "kr",
        "name": "Korea, Republic of"
    },
    {
        "id": "kw",
        "name": "Kuwait"
    },
    {
        "id": "ky",
        "name": "Cayman Islands"
    },
    {
        "id": "kz",
        "name": "Kazakhstan"
    },
    {
        "id": "la",
        "name": "Laos (Lao People's Democratic Republic)"
    },
    {
        "id": "lb",
        "name": "Lebanon"
    },
    {
        "id": "lc",
        "name": "Saint Lucia"
    },
    {
        "id": "li",
        "name": "Liechtenstein"
    },
    {
        "id": "lk",
        "name": "Sri Lanka"
    },
    {
        "id": "lr",
        "name": "Liberia"
    },
    {
        "id": "ls",
        "name": "Lesotho"
    },
    {
        "id": "lt",
        "name": "Lithuania"
    },
    {
        "id": "lu",
        "name": "Luxembourg"
    },
    {
        "id": "lv",
        "name": "Latvia"
    },
    {
        "id": "ly",
        "name": "Libya"
    },
    {
        "id": "ma",
        "name": "Morocco"
    },
    {
        "id": "mc",
        "name": "Monaco"
    },
    {
        "id": "md",
        "name": "Moldova, Republic of"
    },
    {
        "id": "me",
        "name": "Montenegro"
    },
    {
        "id": "mf",
        "name": "Saint Martin"
    },
    {
        "id": "mg",
        "name": "Madagascar"
    },
    {
        "id": "mh",
        "name": "Marshall Islands"
    },
    {
        "id": "mk",
        "name": "North Macedonia"
    },
    {
        "id": "ml",
        "name": "Mali"
    },
    {
        "id": "mm",
        "name": "Myanmar"
    },
    {
        "id": "mn",
        "name": "Mongolia"
    },
    {
        "id": "mo",
        "name": "Macao"
    },
    {
        "id": "mp",
        "name": "Northern Mariana Islands"
    },
    {
        "id": "mq",
        "name": "Martinique"
    },
    {
        "id": "mr",
        "name": "Mauritania"
    },
    {
        "id": "ms",
        "name": "Montserrat"
    },
    {
        "id": "mt",
        "name": "Malta"
    },
    {
        "id": "mu",
        "name": "Mauritius"
    },
    {
        "id": "mv",
        "name": "Maldives"
    },
    {
        "id": "mw",
        "name": "Malawi"
    },
    {
        "id": "mx",
        "name": "Mexico"
    },
    {
        "id": "my",
        "name": "Malaysia"
    },
    {
        "id": "mz",
        "name": "Mozambique"
    },
    {
        "id": "na",
        "name": "Namibia"
    },
    {
        "id": "nc",
        "name": "New Caledonia"
    },
    {
        "id": "ne",
        "name": "Niger"
    },
    {
        "id": "nf",
        "name": "Norfolk Island"
    },
    {
        "id": "ng",
        "name": "Nigeria"
    },
    {
        "id": "ni",
        "name": "Nicaragua"
    },
    {
        "id": "nl",
        "name": "Netherlands"
    },
    {
        "id": "no",
        "name": "Norway"
    },
    {
        "id": "np",
        "name": "Nepal"
    },
    {
        "id": "nr",
        "name": "Nauru"
    },
    {
        "id": "nu",
        "name": "Niue"
    },
    {
        "id": "nz",
        "name": "New Zealand"
    },
    {
        "id": "om",
        "name": "Oman"
    },
    {
        "id": "pa",
        "name": "Panama"
    },
    {
        "id": "pe",
        "name": "Peru"
    },
    {
        "id": "pf",
        "name": "French Polynesia"
    },
    {
        "id": "pg",
        "name": "Papua New Guinea"
    },
    {
        "id": "ph",
        "name": "Philippines"
    },
    {
        "id": "pk",
        "name": "Pakistan"
    },
    {
        "id": "pl",
        "name": "Poland"
    },
    {
        "id": "pm",
        "name": "Saint Pierre and Miquelon"
    },
    {
        "id": "pn",
        "name": "Pitcairn"
    },
    {
        "id": "pr",
        "name": "Puerto Rico"
    },
    {
        "id": "ps",
        "name": "Palestine"
    },
    {
        "id": "pt",
        "name": "Portugal"
    },
    {
        "id": "pw",
        "name": "Palau"
    },
    {
        "id": "py",
        "name": "Paraguay"
    },
    {
        "id": "qa",
        "name": "Qatar"
    },
    {
        "id": "re",
        "name": "Réunion"
    },
    {
        "id": "ro",
        "name": "Romania"
    },
    {
        "id": "rs",
        "name": "Serbia"
    },
    {
        "id": "ru",
        "name": "Russian Federation"
    },
    {
        "id": "rw",
        "name": "Rwanda"
    },
    {
        "id": "sa",
        "name": "Saudi Arabia"
    },
    {
        "id": "sb",
        "name": "Solomon Islands"
    },
    {
        "id": "sc",
        "name": "Seychelles"
    },
    {
        "id": "sd",
        "name": "Sudan"
    },
    {
        "id": "se",
        "name": "Sweden"
    },
    {
        "id": "sg",
        "name": "Singapore"
    },
    {
        "id": "sh",
        "name": "Saint Helena, Ascension and Tristan da Cunha"
    },
    {
        "id": "si",
        "name": "Slovenia"
    },
    {
        "id": "sj",
        "name": "Svalbard and Jan Mayen Islands"
    },
    {
        "id": "sk",
        "name": "Slovakia"
    },
    {
        "id": "sl",
        "name": "Sierra Leone"
    },
    {
        "id": "sm",
        "name": "San Marino"
    },
    {
        "id": "sn",
        "name": "Senegal"
    },
    {
        "id": "so",
        "name": "Somalia"
    },
    {
        "id": "sr",
        "name": "Suriname"
    },
    {
        "id": "ss",
        "name": "South Sudan"
    },
    {
        "id": "st",
        "name": "Sao Tome and Principe"
    },
    {
        "id": "sv",
        "name": "El Salvador"
    },
    {
        "id": "sx",
        "name": "Sint Maarten (Dutch part)"
    },
    {
        "id": "sy",
        "name": "Syrian Arab Republic"
    },
    {
        "id": "sz",
        "name": "Swaziland"
    },
    {
        "id": "tc",
        "name": "Turks and Caicos Islands"
    },
    {
        "id": "td",
        "name": "Chad"
    },
    {
        "id": "tf",
        "name": "French Southern Territories"
    },
    {
        "id": "tg",
        "name": "Togo"
    },
    {
        "id": "th",
        "name": "Thailand"
    },
    {
        "id": "tj",
        "name": "Tajikistan"
    },
    {
        "id": "tk",
        "name": "Tokelau"
    },
    {
        "id": "tl",
        "name": "Timor-Leste"
    },
    {
        "id": "tm",
        "name": "Turkmenistan"
    },
    {
        "id": "tn",
        "name": "Tunisia"
    },
    {
        "id": "to",
        "name": "Tonga"
    },
    {
        "id": "tr",
        "name": "Turkey"
    },
    {
        "id": "tt",
        "name": "Trinidad and Tobago"
    },
    {
        "id": "tv",
        "name": "Tuvalu"
    },
    {
        "id": "tw",
        "name": "Taiwan (Republic of China)"
    },
    {
        "id": "tz",
        "name": "Tanzania, United Republic of"
    },
    {
        "id": "ua",
        "name": "Ukraine"
    },
    {
        "id": "ug",
        "name": "Uganda"
    },
    {
        "id": "um",
        "name": "US Minor Outlying Islands"
    },
    {
        "id": "us",
        "name": "United States"
    },
    {
        "id": "uy",
        "name": "Uruguay"
    },
    {
        "id": "uz",
        "name": "Uzbekistan"
    },
    {
        "id": "va",
        "name": "Holy See (Vatican City State)"
    },
    {
        "id": "vc",
        "name": "Saint Vincent and the Grenadines"
    },
    {
        "id": "ve",
        "name": "Venezuela, Bolivarian Republic of"
    },
    {
        "id": "vg",
        "name": "Virgin Islands, British"
    },
    {
        "id": "vi",
        "name": "Virgin Islands, U.S."
    },
    {
        "id": "vn",
        "name": "Vietnam"
    },
    {
        "id": "vu",
        "name": "Vanuatu"
    },
    {
        "id": "wf",
        "name": "Wallis and Futuna Islands"
    },
    {
        "id": "ws",
        "name": "Samoa"
    },
    {
        "id": "xk",
        "name": "Kosovo"
    },
    {
        "id": "ye",
        "name": "Yemen"
    },
    {
        "id": "yt",
        "name": "Mayotte"
    },
    {
        "id": "za",
        "name": "South Africa"
    },
    {
        "id": "zm",
        "name": "Zambia"
    },
    {
        "id": "zw",
        "name": "Zimbabwe"
    }
]

const GEOMETRY_DASH_ICONS = [
    {
        id: "Auto",
        index: 0
    },
    {
        id: "Easy",
        index: 1
    },
    {
        id: "Normal",
        index: 2
    },
    {
        id: "Hard",
        index: 3
    },
    {
        id: "Harder",
        index: 4
    },
    {
        id: "Insane",
        index: 5
    },
    {
        id: "EasyDemon",
        index: 6
    },
    {
        id: "MediumDemon",
        index: 7
    },
    {
        id: "Demon",
        index: 8
    },
    {
        id: "InsaneDemon",
        index: 9
    },
    {
        id: "ExtremeDemon",
        index: 10
    },
    {
        id: "Unrated",
        index: null
    }
]

console.log(MAP_NAMES.length)

module.exports = {
    MAP_NAMES,
    FLAGS,
    GEOMETRY_DASH_ICONS
}