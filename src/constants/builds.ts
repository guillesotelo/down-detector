export const testBuilds = [
    {
        id: "https://gerrit.net/nightly_rebuild_schema.json",
        title: "Night build",
        classifier: 'kiwi',
        date: "2025-03-23T00:00:00Z",
        target_branch: "master",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "failure",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "pending",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "failure",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "pending",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "failure",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "pending",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "failure",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "pending",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "failure",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "pending",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "failure",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_2.json",
        title: "Alpha build",
        classifier: 'mango',
        date: "2025-03-22T00:00:00Z",
        target_branch: "develop",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "failure",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "pending",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "failure",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "pending",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "failure",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "pending",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "failure",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "pending",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "failure",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "pending",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "failure",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_3.json",
        title: "Beta build",
        classifier: 'orange',
        date: "2025-03-21T00:00:00Z",
        target_branch: "master",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "pending",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "pending",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "pending",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "pending",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "pending",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_4.json",
        title: "Night build 2",
        classifier: 'apple',
        date: "2025-03-20T00:00:00Z",
        target_branch: "feature-xyz",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "pending",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "pending",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "pending",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "pending",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "pending",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_5.json",
        title: "Gamma build",
        classifier: 'strawberry',
        date: "2025-03-19T00:00:00Z",
        target_branch: "develop",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "pending",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "pending",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "pending",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "pending",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "pending",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_6.json",
        title: "Delta build",
        classifier: 'pear',
        date: "2025-03-18T00:00:00Z",
        target_branch: "main",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_7.json",
        title: "Omega build",
        classifier: 'banana',
        date: "2025-03-17T00:00:00Z",
        target_branch: "feature-abc",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_8.json",
        title: "Zeta build",
        classifier: 'grape',
        date: "2025-03-16T00:00:00Z",
        target_branch: "develop",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_9.json",
        title: "Theta build",
        classifier: 'blueberry',
        date: "2025-03-15T00:00:00Z",
        target_branch: "master",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_10.json",
        title: "Iota build",
        classifier: 'peach',
        date: "2025-03-14T00:00:00Z",
        target_branch: "feature-lmn",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_11.json",
        title: "Kappa build",
        classifier: 'kiwi',
        date: "2025-03-13T00:00:00Z",
        target_branch: "develop",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_12.json",
        title: "Lambda build",
        classifier: 'orange',
        date: "2025-03-12T00:00:00Z",
        target_branch: "master",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_13.json",
        title: "Mu build",
        classifier: 'banana',
        date: "2025-03-11T00:00:00Z",
        target_branch: "develop",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_14.json",
        title: "Nu build",
        classifier: 'grape',
        date: "2025-03-10T00:00:00Z",
        target_branch: "feature-xyz",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_15.json",
        title: "Xi build",
        classifier: 'peach',
        date: "2025-03-09T00:00:00Z",
        target_branch: "develop",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_16.json",
        title: "Pi build",
        classifier: 'kiwi',
        date: "2025-03-08T00:00:00Z",
        target_branch: "master",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    },
    {
        id: "https://gerrit.net/nightly_rebuild_schema_17.json",
        title: "Rho build",
        classifier: 'orange',
        date: "2025-03-07T00:00:00Z",
        target_branch: "feature-abc",
        modules: {
            module1: {
                status: "success",
                date: "2025-03-20T00:00:00Z",
                org: {
                    art: "ARTCSAS",
                    solution: "Solution of module"
                }
            },
            module2: {
                status: "success",
                date: "2025-03-19T00:00:00Z",
                org: {
                    art: "ARTBFS",
                    solution: "Solution of failure module"
                }
            },
            module3: {
                status: "success",
                date: "2025-03-18T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Pending solution for module"
                }
            },
            module4: {
                status: "success",
                date: "2025-03-17T00:00:00Z",
                org: {
                    art: "ARTMNO",
                    solution: "Solution for module"
                }
            },
            module5: {
                status: "success",
                date: "2025-03-16T00:00:00Z",
                org: {
                    art: "ARTZYY",
                    solution: "Zeta solution"
                }
            },
            module6: {
                status: "success",
                date: "2025-03-15T00:00:00Z",
                org: {
                    art: "ARTABC",
                    solution: "Solution for failed module"
                }
            },
            module7: {
                status: "success",
                date: "2025-03-14T00:00:00Z",
                org: {
                    art: "ARTDEF",
                    solution: "Pending solution for module"
                }
            },
            module8: {
                status: "success",
                date: "2025-03-13T00:00:00Z",
                org: {
                    art: "ARTVBG",
                    solution: "Solution for successful module"
                }
            },
            module9: {
                status: "success",
                date: "2025-03-12T00:00:00Z",
                org: {
                    art: "ARTSKL",
                    solution: "Module Succeeding"
                }
            },
            module10: {
                status: "success",
                date: "2025-03-11T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Failure solution"
                }
            },
            module11: {
                status: "success",
                date: "2025-03-10T00:00:00Z",
                org: {
                    art: "ARTHJK",
                    solution: "Pending solution"
                }
            },
            module12: {
                status: "success",
                date: "2025-03-09T00:00:00Z",
                org: {
                    art: "ARTQRS",
                    solution: "Completed module"
                }
            },
            module13: {
                status: "success",
                date: "2025-03-08T00:00:00Z",
                org: {
                    art: "ARTWXY",
                    solution: "Module failed"
                }
            },
            module14: {
                status: "success",
                date: "2025-03-07T00:00:00Z",
                org: {
                    art: "ARTOPQ",
                    solution: "Working solution"
                }
            },
            module15: {
                status: "success",
                date: "2025-03-06T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "In progress solution"
                }
            },
            module16: {
                status: "success",
                date: "2025-03-05T00:00:00Z",
                org: {
                    art: "ARTLMN",
                    solution: "Successfully completed"
                }
            },
            module17: {
                status: "success",
                date: "2025-03-04T00:00:00Z",
                org: {
                    art: "ARTVRT",
                    solution: "Solution for failure"
                }
            },
            module18: {
                status: "success",
                date: "2025-03-03T00:00:00Z",
                org: {
                    art: "ARTTUV",
                    solution: "Still pending solution"
                }
            },
            module19: {
                status: "success",
                date: "2025-03-02T00:00:00Z",
                org: {
                    art: "ARTXYZ",
                    solution: "Completed successfully"
                }
            },
            module20: {
                status: "success",
                date: "2025-03-01T00:00:00Z",
                org: {
                    art: "ARTEFG",
                    solution: "Solution failed"
                }
            }
        },
        tags: [
            {
                value: 'Blue Tag',
                color: 'blue',
            },
            {
                value: 'Green Tag',
                color: 'green',
            },
            {
                value: 'Red Tag',
                color: 'red',
            }
        ],
    }
];