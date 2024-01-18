function disableMetadataSelections() {
  document.getElementById("inputSearch").value;
  document.getElementById("selectMeasure").style.display = 'none';
  document.getElementById("selectDimension").style.display = 'none';
  document.getElementById("selectAnalysis").style.display = 'none';
  document.getElementById("inputSearch").style.display = 'block';
}
function disableQuestionBox() {
  document.getElementById("inputSearch").value
  document.getElementById("inputSearch").style.display = 'none';
  document.getElementById("selectMeasure").style.display = 'block';
  document.getElementById("selectDimension").style.display = 'block';
  document.getElementById("selectAnalysis").style.display = 'block';
}

// Design radio button
const labels = document.querySelectorAll('.form-check-label');
labels.forEach(label => {
  const chars = label.textContent.split('');
  label.innerHTML = '';
  chars.forEach(char => {
    label.innerHTML += `<span>${char === ' ' ? '&nbsp' : char}</span>`;
  });
})
