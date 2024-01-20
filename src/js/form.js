import AdvisorService from './advisor';

/* Qlik Sense Insight Advisor */

const advisorService = new AdvisorService();

let submitBtn = document.getElementById('submit-btn');

let fieldMeasuresRef = document.getElementById('fieldMeasures');
let masterMeasuresRef = document.getElementById('masterMeasures');
let fieldDimensionsRef = document.getElementById('fieldDimensions');
let masterDimensionsRef = document.getElementById('masterDimensions');
let analyses = document.getElementById('selectAnalysis');

let alert = document.getElementById('alertAdvisor');
let showCharts = document.getElementById('chart-advisor');

let inputSearch = document.getElementById('inputSearch');
let dimension = document.getElementById('selectDimension');

let requestPayload = { fields: [], libItems: [] };

/* Validate form */

let validInputSearch = false;
let validDimension = false;

inputSearch.addEventListener("blur", () => {

  let inputSearchStr = inputSearch.value;
  if (inputSearchStr) {

    requestPayload.text = inputSearchStr;
    validInputSearch = true;

  } else {

    alert.classList.add("show");
    validInputSearch= false;

  }
});

dimension.addEventListener("blur", () => {

  let targetAnalysis = document.getElementById('selectAnalysis').value;
  let measure = document.getElementById('selectMeasure').value;
  let dimensionType = document.querySelector('#selectDimension option:checked').parentElement.label;
  let measureType = document.querySelector('#selectMeasure option:checked').parentElement.label;

  let dimensionStr = dimension.value;
  if (dimensionStr) {

    if (dimensionType == 'Fields') {
      requestPayload.fields.push({ name: dimensionStr });
    } else {
      requestPayload.libItems.push({ libId: dimensionStr });
    }

    if (measureType == 'Fields') {
      requestPayload.fields.push({ name: measure });
    } else {
      requestPayload.libItems.push({ libId: measure });
    }

    if (targetAnalysis) {
      requestPayload.id = targetAnalysis || 'rank-rank';
    }

    validDimension = true;

  } else {

    alert.classList.add("show");
    validDimension = false;

  }
});

/* Load script */

window.addEventListener('load', (e) => {
  e.preventDefault();

  fetchMedata();

  // Delete Charts layout & Alert after result
  alert.style.display = 'none';
  showCharts.style.display = 'none';
})

/* Submit Form */

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // Delete Objet & Charts layout & Alert after result
  showCharts.innerHTML = "";
  alert.style.display = 'none';
  showCharts.style.display = 'none';

  if (validInputSearch || validDimension) {
    console.log(requestPayload)
    advisorService.fetchRecommendationAndRenderChart(requestPayload);

    document.getElementById('inputSearch').value = "";
    // requestPayload.text = "";
    requestPayload = { fields: [], libItems: [] };

    showCharts.style.display = 'block';
    alert.style.display = "none";

  } else {

    console.log('error')
    // Delete Objet & Charts layout & Alert after result
    document.getElementById('inputSearch').value = "";
    requestPayload = { fields: [], libItems: [] };
    showCharts.innerHTML = ""
    alert.style.display = "block";
    showCharts.style.display = 'none';

  }


});


/**
 * Display selector search on the webpage
 */

async function fetchMedata() {
  // retrieve the analyses types for given application
  const analysesResponse = await advisorService.getAnalyses();
  // retrieve the classification information such as fields and master items along with it's classifications
  const metadata = await advisorService.getClassifications();

  // fill up the analyses dropdown
  analysesResponse.data.forEach((analysis) => {
    const name = analysis.compositions[0].description.short;
    const value = analysis.id;
    analyses.append(new Option(`${name}`, `${value}`));
  });

  // filter out dimension from fields
  const fieldDimensions = metadata.data.fields.filter((field) => field.simplifiedClassifications.includes('dimension'));
  fieldDimensions.forEach((dimension) => {
    const name = dimension.name;
    fieldDimensionsRef.append(new Option(`${name}`, `${name}`));
  });

  // filter out dimension from master items
  const masterDimensions = metadata.data.masterItems.filter((masterItem) =>
    masterItem?.classifications.includes('dimension')
  );

  masterDimensions.forEach((dimension) => {
    const name = dimension.caption;
    const value = dimension.libId;
    masterDimensionsRef.append(new Option(`${name}`, `${value}`));
  });

  // filter out measures from fields
  const fieldMeasures = metadata.data.fields.filter((field) => field.simplifiedClassifications.includes('measure'));
  // fill up the measures dropdown
  fieldMeasures.forEach((measure) => {
    const name = measure.name;
    fieldMeasuresRef.append(new Option(`${name}`, `${name}`));
  });

  // filter out measures from master items
  const masterMeasures = metadata.data.masterItems.filter((masterItem) =>
    masterItem?.classifications.includes('measure')
  );
  // fill up the measures dropdown
  masterMeasures.forEach((measure) => {
    const name = measure.caption;
    const value = measure.libId;    // masterMeasuresRef[masterMeasuresRef.length] = new Option(`${name}`, `${value}`);
    masterMeasuresRef.append(new Option(`${name}`, `${value}`));
  });

}
