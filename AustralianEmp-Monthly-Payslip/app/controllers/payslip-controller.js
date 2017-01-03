//================================================================
// File Name: payslip-controller.js
// Project: Wavebreak-AustralianEmp-Monthly-Payslip
//================================================================

app.controller('PayslipController', ['$scope', 'constants', 'incomeTaxService', 'validationService',
    function ($scope, constants, incomeTaxService, validationService) {

        'use strict';

        var getGrossIncome,
            getNetIncome,
            getPensionContribution,
            getPayPeriod,
            getRoundedValue,
            getIncomeTaxAmount,
            getMonthFromDate,
            createCSVOutput;

        $scope.model = {
            employeeDetails: {
                firstName: '',
                lastName: '',
                annualSalary: '',
                pensionRate: '',
                paymentStartdate: ''
            },
            errorMessage: ''
        };

        $scope.submitDetails = function () {

            var employeePayslip = {
                name:'',
                payPeriod: '',
                grossIncome: '',
                incomeTax: '',
                netIncome: '',
                pensionContribution: ''                
            }

            if (validationService.isNullOrWhiteSpace($scope.model.employeeDetails.firstName,
                $scope.model.employeeDetails.lastName,
                $scope.model.employeeDetails.annualSalary,
                $scope.model.employeeDetails.pensionRate,
                $scope.model.employeeDetails.paymentStartdate)) {
                $scope.model.errorMessage = constants.validationMessages.nullOrUndefinedInput;
            }
            else {
                $scope.model.errorMessage = '';

                employeePayslip.payPeriod = getPayPeriod($scope.model.employeeDetails.paymentStartdate);
                employeePayslip.grossIncome = getGrossIncome($scope.model.employeeDetails.annualSalary);
                employeePayslip.incomeTax = getIncomeTaxAmount($scope.model.employeeDetails.annualSalary);
                employeePayslip.netIncome = getNetIncome(employeePayslip.grossIncome, employeePayslip.incomeTax);
                employeePayslip.pensionContribution = getPensionContribution(employeePayslip.grossIncome, $scope.model.employeeDetails.pensionRate);
                employeePayslip.name = $scope.model.employeeDetails.firstName.concat(' ', $scope.model.employeeDetails.lastName);

                createCSVOutput(employeePayslip);
            }
        };

        //gross income = annual salary / 12 months.
        getGrossIncome = function (annualSalary) {
            if (validationService.isNullOrUndefined(annualSalary) || validationService.isNullOrWhiteSpace(annualSalary)) {
                return constants.validationMessages.nullOrUndefinedInput;
            }

            return getRoundedValue(annualSalary / 12);
        };

        //net income = gross income - income tax.
        getNetIncome = function (grossIncome, incomeTax) {
            if (validationService.isNullOrUndefined(grossIncome) || validationService.isNullOrWhiteSpace(grossIncome)) {
                return constants.validationMessages.nullOrUndefinedInput;
            }

            if (validationService.isNullOrUndefined(incomeTax) || validationService.isNullOrWhiteSpace(incomeTax)) {
                return constants.validationMessages.nullOrUndefinedInput;
            }

            return getRoundedValue(grossIncome - incomeTax);
        };

        //pension contribution = gross income * pension rate.
        getPensionContribution = function (grossIncome, pensionRate) {
            if (validationService.isNullOrUndefined(grossIncome) || validationService.isNullOrWhiteSpace(grossIncome)) {
                return validationService.validationMessages.nullOrUndefinedInput;
            }

            if (validationService.isNullOrUndefined(pensionRate) || validationService.isNullOrWhiteSpace(pensionRate)) {
                return constants.validationMessages.nullOrUndefinedInput;
            }

            var pensionContribution = (grossIncome * pensionRate) / 100;

            return getRoundedValue(pensionContribution);
        };

        //pay period = per calendar month.
        getPayPeriod = function (inputDate) {
            if (validationService.isNullOrUndefined(inputDate) || validationService.isNullOrWhiteSpace(inputDate)) {
                return constants.validationMessages.nullOrUndefinedInput;
            }

            var startDate = new Date(inputDate),
                lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0),
                payPeriod = (startDate.getDate().toString()).
                            concat(' ', getMonthFromDate(startDate), ' - ', lastDayOfMonth.getDate(), ' ', getMonthFromDate(lastDayOfMonth));

            return payPeriod;
        };

        //All calculation results should be rounded to the whole dollars. If >= 50 cents round up to the next dollar increment, otherwise round down.
        getRoundedValue = function (inputValue) {
            if (validationService.isNullOrUndefined(inputValue)) {
                return constants.validationMessages.nullOrUndefinedInput;
            }

            return Math.round(inputValue);
        };

        getIncomeTaxAmount = function (annualIncome) {
            if (validationService.isNullOrUndefined(annualIncome) || validationService.isNullOrWhiteSpace(annualIncome)) {
                return constants.validationMessages.nullOrUndefinedInput;
            }

            var incomeTax = incomeTaxService.getMonthlyTax(annualIncome);
            return Math.round(incomeTax);
        };

        getMonthFromDate = function (inputDate) {
            if (validationService.isNullOrUndefined(inputDate)) {
                return constants.validationMessages.nullOrUndefinedInput;
            }

            var locale = 'en-us',
                month = inputDate.toLocaleString(locale, { month: 'long' });

            return month;
        };

        createCSVOutput = function (jsonData) {            

            var values = [],
                employeeDetailsArray,
                str = '',
                uri = '',
                downloadLink = '';

            for (var property in jsonData) {
                if (!jsonData.hasOwnProperty(property)) {
                    continue;
                }
                values.push(jsonData[property] + ',');
            }
            
            employeeDetailsArray = typeof values != 'object' ? JSON.parse(values) : values;

            for (var i = 0; i < employeeDetailsArray.length; i++) {
                var line = '';
                for (var index in employeeDetailsArray[i]) {
                    line += employeeDetailsArray[i][index];
                }

                str += line;
            }

            str = str.substring(0, str.length - 1);
            uri = 'data:text/csv;charset=utf-8,' + str;

            downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "data.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
    }
]);