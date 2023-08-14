
const file = require("../../api_functions.js")
const transformDate = file.transformDate


// A sample reference date (GMT time)
const referenceDate = [2023, 8, 14, 12, 0, 0];
const referenceDateTuple = (2023, 8, 14, 12, 0, 0);

// A helper function to compare two date tuples
function compareDateTuples(date1, date2) {
  return date1.every((value, index) => value === date2[index]);
}
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Autre moyen ?
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
test('transforms the date to current date ', () => {

  const dateToTransform = [2023, 8, 13, 20, 0, 0]; // September 13, 2023, 20:00:00 (GMT)
  const transformedDate = transformDate(dateToTransform, referenceDate);


  // calcul en dehors de la fonction de la date qu'on devrait avoir ... => un peu bof mais pas vraiment d'autre moyen de faire => forced Date.now à être une valeur
  const currentDate= new Date().toLocaleString('en-US', { timeZone: 'Europe/Brussels', hour12: false });
  const dateComponents = currentDate.split(/[\/,: ]+/).map(component => parseInt(component));
  const [month, day, year, hour, minute, second] = dateComponents;
  const currentDateTuple = [year, month, day, hour, minute, second];

  const timeTranslation = currentDateTuple.map((elem, index) => elem - referenceDate[index]);
  const expectedTransformedDate = dateToTransform.map((elem, index) => elem + timeTranslation[index]);


  expect(compareDateTuples(transformedDate, expectedTransformedDate)).toBe(true);

});

//////// Errors ///////

test('throws an error when date_to_transform is not an array (integer)', () => {
  const invalidDateToTransform = 123;
  const compareDate = [2023, 8, 14, 12, 0, 0];
  
  expect(() => {
    transformDate(invalidDateToTransform, compareDate);
  }).toThrow('date_to_transform must be an array with 6 elements');
});
  
test('throws an error when compare_date is not an array (string)', () => {
  const dateToTransform = [2023, 8, 14, 12, 0, 0];
  const invalidCompareDate = 'invalid';
  
  expect(() => {
    transformDate(dateToTransform, invalidCompareDate);
  }).toThrow('compare_date must be an array with 6 elements');
});
  
test('throws an error when date_to_transform has length other than 6', () => {
  const invalidDateToTransform = [2023, 8, 14];
  const compareDate = [2023, 8, 14, 12, 0, 0];
  
  expect(() => {
    transformDate(invalidDateToTransform, compareDate);
  }).toThrow('date_to_transform must be an array with 6 elements');
});
  
test('throws an error when compare_date has length other than 6', () => {
  const dateToTransform = [2023, 8, 14, 12, 0, 0];
  const invalidCompareDate = [2023, 8, 14];
  
  expect(() => {
    transformDate(dateToTransform, invalidCompareDate);
  }).toThrow('compare_date must be an array with 6 elements');
});

test('throws an error when date_to_transform is an object', () => {
  const invalidDateToTransform = {
    "0": 2023,
    "1": 8,
    "2": 14,
    "3": 12,
    "4": 0,
    "5": 0,
  };
  const compareDate = [2023, 8, 14, 12, 0, 0];

  expect(() => {
    transformDate(invalidDateToTransform, compareDate);
  }).toThrow('date_to_transform must be an array with 6 elements');
});


test('throws an error when date_to_transform is a tuple', () => {
    const invalidDateToTransform = (2023, 12, 14, 12, 0, 0);
    const compareDate = [2023, 8, 14, 12, 0, 0];
  
    expect(() => {
      transformDate(invalidDateToTransform, compareDate);
    }).toThrow('date_to_transform must be an array with 6 elements');
  });

