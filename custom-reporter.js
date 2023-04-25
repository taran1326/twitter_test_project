const fs = require('fs');
const readPkg = require('read-pkg');
const path = require('path');

module.exports = (testResults) => {
    const testResultsString = JSON.stringify(testResults, null, 2);
    output = {}
    results = testResults.testResults[0].testResults;
    failedTestCases = []
    temp = {};
    results.forEach(testCase => {
        if(temp.hasOwnProperty(testCase.ancestorTitles[0])) {
            testSuite = temp[testCase.ancestorTitles[0]];
            tc = {
                "passed": testCase.status === 'passed',
                "description": testCase.title
            }
            testSuite.splice(testSuite.length, 0, tc);
            temp[testCase.ancestorTitles[0]] = testSuite;
            if(testCase.status === 'failed') {
                failedTestCases.push(testCase.title);
            }
        } else {
            temp[testCase.ancestorTitles[0]] = [
                {
                    "passed": testCase.status === 'passed',
                    "description": testCase.title
                }
            ]
            if(testCase.status === 'failed') {
                failedTestCases.push(testCase.title);
            }
        }
    });
    testSuites = []
    for (const [key, value] of Object.entries(temp)) {
        ts = {
            suiteName: key,
            passed: value.every((tc) => tc.passed),
            testCases: value
        }
        testSuites.push(ts)
    }
    count = {
        "total": testSuites.length,
        "passed": testSuites.filter((obj) => obj.passed === true).length
    }
    percentageScore = (count["passed"]/count["total"])*100
    output = {
        "runtime": testResults.testResults[0].perfStats.runtime,
        "percentageScore": percentageScore
    }
    output["count"] = count;
    output["failedTestCases"] = failedTestCases;
    output["suites"] = testSuites
    outputString = JSON.stringify(output, null, 2)

    const packagedData = readPkg.sync(process.cwd())
    const config = packagedData.jestJsonReporter || {};

    const outputFile = config.outputFile || './test-results.json';

    fs.writeFile(outputFile, outputString, (err) => {
        if (err) {
            console.warn('Unable to write test results JSON', err);
        }
    });

    return outputString;
};
