//================================================================
// File Name: income-tax-service.js
// Project: Wavebreak-AustralianEmp-Monthly-Payslip
//================================================================

angular.module('services').service('incomeTaxService', [
    'constants','validationService',
    function (constants, validationService) {
        'use strict';

        var getMonthlyTax = function (annualIncome) {

                if (!validationService.isNullOrUndefined(annualIncome)) {
                    var taxPayable = 0, monthsInYr = 12;

                    if (annualIncome > 0 && annualIncome <= 18200) {
                        //0 - $18,200 Nil.
                        taxPayable = ((annualIncome) * constants.taxBands.band0) / monthsInYr;

                    } else if (annualIncome >= 18201 && annualIncome <= 37000) {
                        //$18,201 - $37,000 19c for each $1 over $18,200.
                        taxPayable = ((annualIncome) * constants.taxBands.band1) / monthsInYr;

                    } else if (annualIncome >= 37001 && annualIncome <= 80000) {
                        //$37,001 - $80,000 $3,572 plus 32.5c for each $1 over $37,000.
                        taxPayable = (((annualIncome - 37000) * constants.taxBands.band2) + 3572) / monthsInYr;

                    } else if (annualIncome >= 80001 && annualIncome <= 180000) {
                        //$80,001 - $180,000 $17,547 plus 37c for each $1 over $80,000.
                        taxPayable = (((annualIncome - 80000) * constants.taxBands.band3) + 17547) / monthsInYr;

                    } else if (annualIncome >= 180001) {
                        //$180,001 and over $54,547 plus 45c for each $1 over $180,000.
                        taxPayable = (((annualIncome - 180000) * constants.taxBands.band4) + 54547) / monthsInYr;
                    }

                    return taxPayable;
                }

                return constants.validationMessages.nullOrUndefinedInput;
            },
            service = {
                getMonthlyTax: getMonthlyTax
            };

        return service;
    }
]);