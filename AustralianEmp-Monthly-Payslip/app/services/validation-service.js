//================================================================
// File Name: validation-service.js
// Project: Wavebreak-AustralianEmp-Monthly-Payslip
//================================================================

angular.module('services').service('validationService',
    function () {
        'use strict';

        var isNullOrUndefined = function (value) {
            if (arguments.length === 0) {
                return true;
            }

            var flag = false;

            angular.forEach(arguments, function (value) {
                if (flag) {
                    return;
                }

                if (value === null || angular.isUndefined(value)) {
                    flag = true;
                }
            });

            return flag;
        },

        isNullOrWhiteSpace = function (value) {
            if (isNullOrUndefined.apply(this, arguments)) {
                return true;
            }

            var flag = false;

            angular.forEach(arguments, function (value) {
                if (flag) {
                    return;
                }

                if (value.toString().trim().length < 1) {
                    flag = true;
                }
            });

            return flag;
        },

        service = {
            isNullOrUndefined: isNullOrUndefined,
            isNullOrWhiteSpace: isNullOrWhiteSpace
        };

        return service;
    });

