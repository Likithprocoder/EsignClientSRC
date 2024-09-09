import React, { useState } from 'react'

function UserDetailValidation(userData, validationType) {

  if (validationType === "Aadhaar") {
    if (isNaN(userData)) {
      return "isNotANumber";
    } else {
      let value = userData;
      let aadhaarNumber = "";
      for (let key in value) {
        if (value[key] !== "") {
          aadhaarNumber = aadhaarNumber + value[key];
        }
        else {
          continue;
        }
      }
      return (validate(aadhaarNumber));
      // validates Aadhar number received as string

      function validate(aadharNumber) {
        // multiplication table
        let d = [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
          [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
          [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
          [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
          [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
          [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
          [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
          [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
          [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ]

        // permutation table
        let p = [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
          [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
          [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
          [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
          [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
          [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
          [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
        ]
        let c = 0;
        let invertedArray = aadharNumber.split('').map(Number).reverse();
        invertedArray.forEach((val, i) => {
          c = d[c][p[(i % 8)][val]];
        })
        return (c === 0)
      }
    }
  } else if (validationType === "PAN") {
    let panRegex = new RegExp(/[A-Za-z]{3}[PpCcHhAaBbGgJjLlFfTt]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/);
    let allowPan = panRegex.test(userData);
    return allowPan;
  } else if (validationType === "Mobile Number") {
    if (isNaN(userData)) {
      return "isNotANumber";
    }
    else {
      let mobileNumberRegex = new RegExp(/^[6-9]{1}[0-9]{9}$/);
      let allowPan = mobileNumberRegex.test(userData);
      return allowPan;
    }
  }
  else if (validationType === "Pincode") {
    if (isNaN(userData)) {
      return "isNotANumber";
    }
    else {
      let pincodeRegex = new RegExp(/^[1-9]{1}[0-9]{5}$/);
      let allowPan = pincodeRegex.test(userData);
      return allowPan;
    }
  } else if (validationType === "ageValidation") {
    let selectedDate = new Date(userData);
    let SelectedDate = selectedDate.getDate();
    let SelectedMonth = selectedDate.getMonth() + 1;
    let SelectedYear = selectedDate.getFullYear();

    let CurrentDate = new Date();
    let currentDate = CurrentDate.getDate();
    let currentMonth = CurrentDate.getMonth() + 1;
    let cureentYear = CurrentDate.getFullYear();

    if (SelectedYear >= cureentYear) {
      return "invalidInput";
    } else {
      let age = cureentYear - SelectedYear;
      if (age < 18 || age > 65) {
        return "ageProblem";
      } else {
        if (age >= 18 && age <= 65) {
          if (age == 18) {
            if (SelectedMonth >= currentMonth) {
              return true;
            } else {
              return "ageProblem";
            }
          } else if (age == 65) {
            if (SelectedMonth < currentMonth) {
              return true;
            } else {
              return "ageProblem";
            }
          } else {
            return true;
          }
        }
      }
    }
  }
  else if (validationType === "Date of Birth") {
    console.log("date of birth called!!");
    let selectedDate = new Date(userData);
    let SelectedDate = selectedDate.getDate();
    let SelectedMonth = selectedDate.getMonth() + 1;
    let SelectedYear = selectedDate.getFullYear();
    let CurrentDate = new Date();
    let currentDate = CurrentDate.getDate();
    let currentMonth = CurrentDate.getMonth() + 1;
    let cureentYear = CurrentDate.getFullYear();
    if ((SelectedDate === currentDate && SelectedMonth === currentMonth && SelectedYear === cureentYear) || (selectedDate > CurrentDate)) {
      return false;
    }
    else {
      return true;
    }
  }
  else {
    let emailIdRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    let allowPan = emailIdRegex.test(userData);
    return allowPan;
  }
}
export default UserDetailValidation