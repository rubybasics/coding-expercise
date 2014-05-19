kodility.ChallengeManagement = {

    challengeModel: {},

    constructor: function () {
        this.challengeModel = JSON.parse($('#challengeModel').val());
        if (!jQuery.isEmptyObject(this.challengeModel)) {
            this.prepareForUpdate(this.challengeModel);
        }
    },

    bindEvents: function () {
        $(document).on('click', '.removeInput', this.removeInputAction);

        $(document).on('click', '.removeTestCase', this.removeTestCaseAction);

        $('#addNewInput').click(this.addNewInputAction);

        $('#addNewTestCase').click(this.addNewTestCaseAction);

        $('#saveButton').click(this.saveChallenge);
    },

    prepareForUpdate: function (challengeModel) {
        $('input[name="title"]').each(function () {
            var $that = $(this);
            var lingo = $that.parent('div').data('lingo');
            var title = challengeModel.titles.filter(function (element) {
                return element.lingo == lingo;
            })[0].text;
            $that.val(title);
        });

        $('textarea[name="description"]').each(function () {
            var $that = $(this);
            var lingo = $that.parent('div').data('lingo');
            var description = challengeModel.descriptions.filter(function (element) {
                return element.lingo == lingo;
            })[0].text;
            $that.val(description);
        });

        var $inputsTableBody = $('#inputsTable > tbody');
        $inputsTableBody.find('tr').remove();
        challengeModel.inputTypes.forEach(function (inputType) {
            kodility.ChallengeManagement.addNewInputAction();
            $inputsTableBody.find('tr:last').find('select > option[value=' + inputType + ']').attr('selected', 'selected');
        });

        $('#outputTable').find('select > option[value=' + challengeModel.outputType + ']').attr('selected', 'selected');

        var $testCasesTableBody = $('#testCasesTable').find('tbody');
        $testCasesTableBody.find('tr').remove();
        challengeModel.testCases.forEach(function () {
            kodility.ChallengeManagement.addNewTestCaseAction();
        });
        var $testCaseRows = $testCasesTableBody.find('tr');
        for (var testCaseIndex = 0; testCaseIndex < challengeModel.testCases.length; testCaseIndex++) {
            var $testCaseRowInputs = $($testCaseRows[testCaseIndex]).find('input[name="inputValue"]');
            $testCaseRowInputs.each(function (inputIndex, $input) {
                $($input).val(challengeModel.testCases[testCaseIndex].inputValues[inputIndex]);
            });
            $($testCaseRows[testCaseIndex]).find('input[name="outputValue"]').val(challengeModel.testCases[testCaseIndex].outputValue);
        }
    },

    removeInputAction: function () {
        $(this).parents('tr').remove();

        kodility.ChallengeManagement.adjustInputValues();
    },

    addNewInputAction: function () {
        var inputRow = ''
            + '<tr>'
            + '   <td>'
            + '       <select name="inputType">'
            + '           <option value="Integer">' + kodility.utils.i18n('Integer') + '</option>'
            + '           <option value="Text">' + kodility.utils.i18n('Text') + '</option>'
            + '       </select>'
            + '   </td>'
            + '   <td>'
            + '       <a class="removeInput">' + kodility.utils.i18n('button.remove') + '</a>'
            + '   </td>'
            + '</tr>';

        $('#inputsTable > tbody').append($(inputRow));

        kodility.ChallengeManagement.adjustInputValues();
    },

    adjustInputValues: function () {
        var currentInputsCount = $('#inputsTable > tbody > tr').length;

        $('#testCasesTable').find('tbody > tr').each(function () {
            var $tr = $(this);
            var inputValues = $tr.find("input[name='inputValue']");
            var inputValuesCount = inputValues.length;

            if (currentInputsCount < inputValuesCount) {
                inputValues.last().remove();
            } else if (currentInputsCount > inputValuesCount) {
                var inputValueRow = '<input class="form-control" type="text" name="inputValue"/>'
                $($tr.find('td')[0]).append(inputValueRow);
            }
        });
    },

    removeTestCaseAction: function () {
        $(this).parents('tr').remove();
    },

    addNewTestCaseAction: function () {
        var currentInputsCount = $('#inputsTable > tbody > tr').length;

        var testCaseRow = ''
            + '<tr>'
            + '     <td>';

        for (var i = 1; i <= currentInputsCount; i++) {
            testCaseRow += '<input class="form-control" type="text" name="inputValue"/>'
        }

        testCaseRow += ''
            + '     </td>'
            + '     <td>'
            + '         <input class="form-control" type="text" name="outputValue"/>'
            + '     </td>'
            + '     <td>'
            + '         <a class="removeTestCase">' + kodility.utils.i18n('button.remove') + '</a>'
            + '     </td>'
            + '</tr>';

        $('#testCasesTable').find('tbody').append($(testCaseRow));
    },

    saveChallenge: function () {
        var $saveButton = $(this);

        var titles = [];
        $('input[name="title"]').each(function () {
            var lingo = $(this).parent('div').data('lingo');
            var title = $(this).val();
            titles.push({
                lingo: lingo,
                text: title
            });
        });

        var descriptions = [];
        $('textarea[name="description"]').each(function () {
            var lingo = $(this).parent('div').data('lingo');
            var description = $(this).val();
            descriptions.push({
                lingo: lingo,
                text: description
            });
        });

        var inputTypes = [];
        $('#inputsTable select[name="inputType"]').each(function () {
            inputTypes.push($(this).val());
        });

        var outputType = $('select[name="outputType"]').val();

        var testCases = [];
        $('#testCasesTable tbody tr').each(function () {
            var $columns = $(this).find('td');

            var inputValues = [];
            $($columns[0]).find('input').each(function () {
                inputValues.push($(this).val());
            });

            var outputValue = $($columns[1]).find('input').val();

            testCases.push({
                inputValues: inputValues,
                outputValue: outputValue
            });
        });

        var requestData = {
            challengeId: kodility.ChallengeManagement.challengeModel.challengeId,
            titles: titles,
            descriptions: descriptions,
            inputTypes: inputTypes,
            outputType: outputType,
            testCases: testCases
        }

        var loadingStateConfig = kodility.utils.setLoadingState({element: $saveButton, icon: 'floppy-open'});
        kodility.utils.resetHash();
        kodility.utils.post(
            'challenges/saveChallenge',
            requestData,
            function (response) {
                kodility.utils.resetLoadingState(loadingStateConfig);
                if (response.success) {
                    kodility.utils.go(kodility.utils.urlFor('challenges/' + response.challengeId));
                } else {
                    var containerId = '#validationMessages';
                    var $validationMessages = $(containerId);
                    $validationMessages.removeClass('hide');

                    var $messageList = $validationMessages.find('ul');
                    $messageList.find('li').remove();
                    response.errorCodes.forEach(function (errorCode) {
                        $messageList.append('<li>' + kodility.utils.i18n(errorCode) + '</li>');
                    });

                    location.hash = containerId;
                }
            }
        );
    }

};