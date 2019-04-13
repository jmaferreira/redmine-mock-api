var express = require('express');
var axios = require('axios');
var router = express.Router();
var users = require('../data/users.json').users;


//utf8=✓&op[closed_on]=>=&v[closed_on][]=2019-01-01

// Globals
let ISSUES_COUNTER = 1;
const NUMBER_SUPPORT_STAFF = 10;
const MAX_ISSUES_PER_MINUTE = 5;

router.get('/', function (req, res, next) {
  let { after, limit = 1000 } = req.query;

  if (!after) return res.status(400).jsonp({ errorMessage: 'after=yyyy-mm-ddThh:mmZ ISO 8601 datetime parameter missing from query string' })
  if (new Date(after) >= new Date()) return res.status(400).jsonp({ errorMessage: 'Provided date must be in the past' })

  try {
    let numberOfIssuesPerMinute = randomInt(1, MAX_ISSUES_PER_MINUTE);
    let minutesSinceAfter = minutesBetween(new Date(after), new Date());
    let numberIssuesToGenerate = Math.min(minutesSinceAfter * numberOfIssuesPerMinute, limit);

    console.debug("No of issues to be generated", numberIssuesToGenerate)
    console.debug("minutesSinceAfter", minutesSinceAfter)
    console.debug("numberOfIssuesPerMinute", numberOfIssuesPerMinute)

    let generatedIssues = [];
    for (let i = 0; i < numberIssuesToGenerate; i++) {
      let newIssue = generateIssue(after);
      generatedIssues.push(newIssue);
    }

    let issues = JSON.parse(JSON.stringify(mockIssueList));


    issues.total_count = generatedIssues.length;
    issues.limit = generatedIssues.length;
    issues.issues = generatedIssues;
    res.jsonp(issues);
  } catch (e) {
    console.debug(e);
    res.status(500).jsonp({ errorMessage: e.message })
  }


});



function generateIssue(afterDate) {
  let newIssue = JSON.parse(JSON.stringify(mockIssue));

  let diffDate = new Date(Math.floor((new Date() - new Date(afterDate)) * Math.random()));
  let closedOn = new Date(new Date() - diffDate);

  let author = getRandomAuthor();
  let assignee = getRandomAssignee();

  newIssue.id = ISSUES_COUNTER++;

  newIssue.project = getRandomProject();
  newIssue.updated_on = closedOn.toISOString();
  newIssue.closed_on = closedOn.toISOString();
  newIssue.created_on = new Date(Math.floor(closedOn - 60 * 60 * 1000 * 24 * 20 * Math.random())).toISOString();
  newIssue.start_date = newIssue.created_on;
  newIssue.assigned_to = getRandomAssignee();
  newIssue.author = getRandomAuthor();
  newIssue.priority = getRandomPriority();
  newIssue.tracker = getRandomTracker();

  return newIssue;
}

function getRandomProduct() {
  //  let mockProducts = ["GoGo Parot", "DragonFly", "Game of Elderly Jumpers", "Fleshaway", "Protected Dangerous"];
  let mockProducts = ["Dimension", "Adabas D", "Alpha Five", "Apache Derby", "Aster Data", "Amazon Aurora", "Altibase", "CA Datacom", "CA IDMS", "Clarion", "ClickHouse", "Clustrix", "CSQL", "CUBRID", "DataEase", "Database Management Library", "Dataphor", "dBase", "Derby (aka Java DB)", "Empress Embedded Database", "Exasol", "EnterpriseDB", "eXtremeDB", "FileMaker Pro", "Firebird", "FrontBase", "Google Fusion Tables", "Greenplum", "GroveSite", "H2", "Helix database", "HSQLDB", "IBM DB2", "IBM Lotus Approach", "IBM DB2 Express-C", "Infobright", "Informix", "Ingres", "InterBase", "InterSystems Caché", "LibreOffice Base", "Linter", "MariaDB", "MaxDB", "MemSQL", "Microsoft Access", "Microsoft Jet Database Engine (part of Microsoft Access)", "Microsoft SQL Server", "Microsoft SQL Server Express", "SQL Azure (Cloud SQL Server)", "Microsoft Visual FoxPro", "Mimer SQL", "MonetDB", "mSQL", "MySQL", "Netezza", "NexusDB", "NonStop SQL", "NuoDB", "Omnis Studio", "Openbase", "OpenLink Virtuoso (Open Source Edition)", "OpenLink Virtuoso Universal Server", "OpenOffice.org Base", "Oracle", "Oracle Rdb for OpenVMS", "Panorama", "Paradox", "Pervasive PSQL", "Polyhedra", "PostgreSQL", "Postgres Plus Advanced Server", "Progress Software", "RDM Embedded", "RDM Server", "R:Base", "SAND CDBMS", "SAP HANA", "SAP Adaptive Server Enterprise", "SAP IQ (formerly known as Sybase IQ)", "SQL Anywhere (formerly known as Sybase Adaptive Server Anywhere and Watcom SQL)", "solidDB", "SQLBase", "SQLite", "SQream DB", "SAP Advantage Database Server (formerly known as Sybase Advantage Database Server)", "Teradata", "Tibero", "TimesTen", "Trafodion", "txtSQL", "Unisys RDMS 2200", "UniData", "UniVerse", "Vectorwise", "Vertica", "VoltDB"];
  let randomIndex = randomInt(0, mockProducts.length - 1);
  return mockProducts[randomIndex];
}


function getRandomAuthor() {
  let randomIndex = randomInt(11, 100 - 1);
  let user = users[randomIndex];
  return {
    "author": {
      "id": user.id,
      "name": `${user.firstname} ${user.lastname}`
    }
  };
}

function getRandomAssignee() {
  let randomIndex = randomInt(1, 10);
  let user = users[randomIndex];
  return {
    "assignee": {
      "id": user.id,
      "name": `${user.firstname} ${user.lastname}`
    }
  };
}


function randomInt(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomPriority() {

  let priorities = [{
    "priority": {
      "id": 5,
      "name": "High (1 day)"
    }
  }, {
    "priority": {
      "id": 4,
      "name": "Normal (5 days)"
    }
  }, {
    "priority": {
      "id": 3,
      "name": "Low (10 days)"
    }
  }]
  let randomIndex = randomInt(0, 2);
  return priorities[randomIndex];
}


let mockIssueList = {
  "total_count": 0,
  "offset": 0,
  "limit": 0,
  "issues": [
  ]
}

function getRandomClient() {
  let clients = ["United Services Automobile Association", "US Cellular", "U.S. Steel", "Uwajimaya", "Valero Energy Corporation", "Vantec", "The Vanguard Group", "Vaughan & Bushnell Manufacturing", "VECO Corporation", "VF Corporation", "Lee (jeans)", "Venus Swimwear", "Verbatim Corporation", "Vertex Pharmaceuticals", "Victoria's Secret", "ViewSonic", "Vistikon", "VIZ Media", "Vizio", "Vectren", "Verizon", "Verizon Wireless", "Vermeer Industries", "Viacom", "Visa Inc.", "Vivitar", "VMware", "Vocera Communications", "VonMaur", "Vulcan Corporation", "Wahl Clipper", "Washburn Guitars", "Walmart", "Walgreens", "Walt Disney Company", "Warner Bros. Entertainment", "Watco Companies", "W.C. Bradley Co.", "The Weinstein Company", "Welch's", "WellPoint", "Wells Fargo Bank, N.A.", "Wendy's/Arby's Group", "Werner Enterprises", "W. R. Grace and Company", "Westat", "West Liberty Foods", "Western Digital", "Westinghouse Digital LLC", "Whataburger", "Wheeling-Pittsburgh Steel", "Whirlpool Corporation", "Winnebago Industries", "Wizards of the Coast", "Whole Foods Market", "W. L. Gore & Associates", "Gore-Tex", "World Airways", "World Financial Group", "WWE", "Wynn Resorts", "Xerox", "Xilinx", "XPAC", "XPLANE", "Yahoo!", "YASH Technologies", "YRC Worldwide Inc.", "Yum! Brands, Inc.", "Zapata", "Zappos.com", "Zaxby's", "Zenith Electronics", "ZOMM, LLC", "Zoo York", "Zoom Technologies", "Zune"];
  let randomIndex = randomInt(0, clients.length - 1);
  return clients[randomIndex];
}
function getRandomProject() {
  let product = getRandomProduct();
  let client = getRandomClient();

  return {
    "project": {
      "id": randomInt(1, 1000),
      "name": `Helpdesk | ${product}@${client}`
    }
  }
}

function getRandomTracker() {
  let trackers = [
    {
      "id": 1,
      "name": "Bug"
    }, {
      "id": 3,
      "name": "Support"
    }, {
      "id": 9,
      "name": "Question"
    }, {
      "id": 45,
      "name": "Report"
    }
  ];
  let randomIndex = randomInt(0, trackers.length - 1);

  return trackers[randomIndex];

}
let mockIssue = {
  "id": 38398,
  "project": {
    "id": 535,
    "name": "Helpdesk | Archeevo@Arquivo Regional da Madeira"
  },
  "tracker": {
    "id": 3,
    "name": "Support"
  },
  "status": {
    "id": 5,
    "name": "Closed"
  },
  "priority": {
    "id": 3,
    "name": "Low (10 days)"
  },
  "author": {
    "id": 1136,
    "name": "Nuno Mota"
  },
  "assigned_to": {
    "id": 1136,
    "name": "Nuno Mota"
  },
  "subject": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit sapiente omnis blanditiis! Qui voluptas, deserunt nostrum cupiditate aliquam ea quod odio repellendus maiores aut nisi molestias officia soluta consectetur similique?",
  "start_date": "2019-04-02",
  "done_ratio": 100,
  "closed_on": "2019-04-02T11:24:50Z",
  "created_on": "2019-04-02T11:24:50Z",
  "updated_on": "2019-04-02T14:08:31Z"
}


function minutesBetween(initialDate, finalDate) {
  return Math.round((finalDate - initialDate) / (1000 * 60));
}


module.exports = router;
