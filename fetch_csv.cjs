const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZ7o3cXQMaWIn_xPdTthvO11g7s4u6So32rDrJXoX-arcwHHb8DemgvPr0q4rmpM85xFlUL0wZ_IUe/pub?output=csv';

fetch(url)
  .then(res => res.text())
  .then(text => {
    console.log(text.split('\n').slice(0, 15).join('\n'));
  })
  .catch(err => console.error(err));
