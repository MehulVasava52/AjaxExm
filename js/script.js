"use strict";

window.onload = init();

/**
 * Function init will initially populates options in country,
 * default selected option in select tags,
 * add default text in print section,
 * attach change event listener to select element and print button element.
 */
function init() {
  var selectTags = document.querySelectorAll("select");
  var selectElementsContainer = document.getElementsByClassName("form-items")[0];

  for(var i=0; i<3; i++) {
    var selectName = selectTags[i].name;
    selectTags[i].add(createOption("Select "+selectName, "Select "+selectName, true));
  }

  var printBtn = document.getElementsByClassName("print-btn")[0];
  var paramObj = {
    "countrySelectTag": selectTags[0],
    "stateSelectTag": selectTags[1],
    "citySelectTag": selectTags[2]
  };
  selectElementsContainer.addEventListener("change", selectChangeListener.bind(this, paramObj));
  printBtn.addEventListener('click', buttonClickListener.bind(this, paramObj));
  requestData(null, selectTags[0]);
}

/**
 * selectChangeListener is change listener for select tags.if country, state or city is changed,
 * then reset and populate data accordingly for next select elements.
 * @param {Object} paramsObject contains all select tags.
 * @param {event object} event captures change event.
 */
function selectChangeListener(paramsObject, event) {
  var countrySelectTag = paramsObject.countrySelectTag;
  var stateSelectTag = paramsObject.stateSelectTag;
  var citySelectTag = paramsObject.citySelectTag;

  //By default hide output and disable button on select change
  printOutput(true);
  disableButton(true);

  //checking whether value is selected or not for every Select tag.
  var isCountrySelected = !countrySelectTag.options[countrySelectTag.selectedIndex].defaultSelected;
  var isStateSelected = !stateSelectTag.options[stateSelectTag.selectedIndex].defaultSelected;
  var isCitySelected = !citySelectTag.options[citySelectTag.selectedIndex].defaultSelected;

  switch (event.target.name) {
    case 'Country':
      resetSelectTag([stateSelectTag, citySelectTag]);
      if (isCountrySelected) {
        requestData(event.target, stateSelectTag);
      }
      break;

    case 'State':
      resetSelectTag([citySelectTag]);
      if (isStateSelected) {
        requestData(event.target, citySelectTag);
      }
      break;

    default:
      if (isCitySelected) {
        disableButton(false);
      }
      break;
  }
}

/**
 * buttonClickListener is click listener for print button,
 * And print data values in output section.
 * @param {Object} paramsObject object contains all select tags.
 * @param {event object} event captures change event.
 */
function buttonClickListener(paramsObject, event) {
  event.preventDefault();

  //fetching span tags in which we need to show the result.
  var printCountry = document.getElementById('selected-country');
  var printState = document.getElementById('selected-state');
  var printCity = document.getElementById('selected-city');

  var countrySelectTag = paramsObject.countrySelectTag;
  var stateSelectTag = paramsObject.stateSelectTag;
  var  citySelectTag = paramsObject.citySelectTag;

  printCountry.textContent = countrySelectTag.value;
  printState.textContent = stateSelectTag.value;
  printCity.textContent = citySelectTag.value;

  printOutput(false);
}

/**
 * printOutput Function will hide or show output result container.
 * @param {Boolean} val true if output needs to be hide else false.
 */
function printOutput(val) {
  var outputContainer = document.getElementsByClassName("print-result")[0];
  val ? outputContainer.classList.add('hide') : outputContainer.classList.remove('hide');
}

/**
 * disableButton Function will disable or enable print button.
 * @param {Boolean} val true if button is needed to be disabled else false.
 */
function disableButton(val) {
  var printBtn = document.getElementsByClassName("print-btn")[0];
  printBtn.disabled = val;
}

/**
 * requestData is general function for making GET data from server.
 * After getting response it will call populateOptions function.
 * @param {Html Element} et event target object for generating url.
 * @param {Html Element} selectObj select tag in which response options needs to be populated.
 */
function requestData(et, selectObj) {
  var xhttp = new XMLHttpRequest();
  var url = generateUrl(et);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      populateOptions(JSON.parse(this.response), selectObj);
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();
}

/**
 * generateUrl function will append query params to base url and generate url according to conditions.
 * @param {Html Elemet} et event target select element on change event.
 * @return {String} retruns generated url string.
 */
function generateUrl(et) {
  var baseUrl = './php/location_data.php';
  var countrySelectTag = document.querySelector("select[name='Country']");
  var queryParams;

  if (!et) {
    queryParams = '';
  } else if (et.name === 'Country') {
    queryParams = "?country=" + et.value;
  } else if (et.name === 'State') {
    queryParams = "?country=" + countrySelectTag.value + "&state=" + et.value;
  }

  return baseUrl + queryParams;
}

/**
 * createOption Function will create new option from given text data and value as parameters.
 * @param {String} text Text for the option tag.
 * @param {String} val Value for the option.
 * @param {Boolean} defaultSelected whether the option is defaultselected.
 * @return returns created new option element.
 */
function createOption(text, val, defaultSelected) {
  var option = document.createElement("option");

  option.text = text;
  option.value = val;
  option.defaultSelected = defaultSelected;

  return option;
}

/**
 * Function populateOptions is general function for populating options in select tag.
 * @param {Array} optionData response data from server for options creation.
 * @param {Html Element} selectElement target select element in which options need to be populated.
 */
function populateOptions(optionData, selectElement) {
  optionData.forEach(function (option) {
    selectElement.add(createOption(option, option, false));
  });
}

/**
 * resetSelectTag Function will remove all the options and add default option for given select tags.
 * @param {Array} selectTags select elements in which options need to be removed.
 */
function resetSelectTag(selectTags) {
  selectTags.forEach(function (select) {
    var defaultOptText = 'Select '+select.name;
    if (select.options.length > 1) {
      select.textContent = '';
      select.add(createOption(defaultOptText, defaultOptText, true));
    }
  });
}