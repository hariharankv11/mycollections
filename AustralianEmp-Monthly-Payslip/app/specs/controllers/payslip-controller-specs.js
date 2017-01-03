//================================================================
// File Name: payslip-controller-specs.js
// Project: Wavebreak-AustralianEmp-Monthly-Payslip
//================================================================

/// <reference path="../_references.js" />

describe('payslip-controller tests', function () {
    'use strict';

    beforeEach(module('common'));
    beforeEach(module('services'));
    beforeEach(module('app'));

    var scope,
        mockIncomeTaxService,
        mockConstants,
        mockValidationService,
        controller;

    beforeEach(inject(function ($scope,$controller, constants, incomeTaxService, validationService) {
        mockConstants = {
            validationMessages: {
                nullOrUndefinedInput: 'Input is null or undefined.'
            }
        };
        mockIncomeTaxService = {};
        mockValidationService = {
            getMonthlyTax: function ()
            {
                return {
                    then: function () { }
                };
            }
        };
        scope = $scope.$new();

        scope.model = {
            employeeDetails: {
                firstName: 'David',
                lastName: 'Rudd',
                annualSalary: '60050',
                pensionRate: '9',
                paymentStartdate: '2016-03-01'
            }
        };

        controller = $controller('PayslipController',
                {
                    $scope: scope,
                    constants: mockConstants,
                    incomeTaxService: mockIncomeTaxService,
                    validationService: mockValidationService
                });

    }));


    it('controller being constructed', function () {
        expect(controller).toBeTruthy();
    });

    it('testing submit details function', function () {
        scope.submitDetails();

        expect(mockValidationService).toHaveBeenCalled();
        expect(mockIncomeTaxService.getMonthlyTax).toHaveBeenCalledWith(scope.model.employeeDetails.annualSalary);
    });

    it('testing submit details function with invalid annual income', function () {
        scope.model = {
            employeeDetails:
                { annualSalary: '' }
        };

        scope.submitDetails();

        expect(mockValidationService).toHaveBeenCalled();
        var returnValue = mockIncomeTaxService.getMonthlyTax(scope.model.employeeDetails.annualSalary);
        expect(returnValue).toBe(mockConstants.val.nullOrUndefinedInput);
    });
});
