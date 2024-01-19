import AdvisorService from './advisor';

/* Qlik Sense Insight Advisor */

const advisorService = new AdvisorService();

let submitBtn = document.getElementById('submit-btn');

let fieldMeasuresRef = document.getElementById('fieldMeasures');
let masterMeasuresRef = document.getElementById('masterMeasures');
let fieldDimensionsRef = document.getElementById('fieldDimensions');
let masterDimensionsRef = document.getElementById('masterDimensions');
let analyses = document.getElementById('selectAnalysis');

const alert = document.getElementById('alertAdvisor');
const showCharts = document.getElementById('chart-advisor');

window.addEventListener('load', (e) => {
  e.preventDefault();

  fetchMedata();
  alert.style.display = 'none';
  showCharts.style.display = 'none';
})

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const inputSearch = document.getElementById('inputSearch').value;
  const targetAnalysis = document.getElementById('selectAnalysis').value;
  const dimension = document.getElementById('selectDimension').value;
  const dimensionType = document.querySelector('#selectDimension option:checked').parentElement.label;
  const measure = document.getElementById('selectMeasure').value;
  const measureType = document.querySelector('#selectMeasure option:checked').parentElement.label;

  // Delete Charts layout & Alert after result
  showCharts.classList.remove("show");
  showCharts.classList.add("hide");
  alert.classList.remove("show");
  alert.classList.add("hide");
  document.querySelector('#alertAdvisor').innerHTML = '';
  document.querySelector('#chart-advisor').innerHTML = '';

  const requestPayload = { fields: [], libItems: [] };

  if (requestPayload.fields.length == 0 ||  inputSearch != "") {
    document.getElementById('formAdvisor').reset();

    alert.classList.add("show");

    showCharts.classList.remove("show");
    showCharts.classList.add("hide");
  }

  if (dimensionType == 'Fields') {
    requestPayload.fields.push({ name: dimension });
  } else {
    requestPayload.libItems.push({ libId: dimension });
  }

  if (measureType == 'Fields') {
    requestPayload.fields.push({ name: measure });
  } else {
    requestPayload.libItems.push({ libId: measure });
  }

  if (inputSearch != "") {
    requestPayload.text = inputSearch;
  }

  if (targetAnalysis) {
    requestPayload.id = targetAnalysis || 'rank-rank';
  }

  advisorService.fetchRecommendationAndRenderChart(requestPayload);

  // Display Charts layout after result
  showCharts.style.display = 'block';

  document.getElementById('inputSearch').value = "";
  requestPayload.value = "";

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
