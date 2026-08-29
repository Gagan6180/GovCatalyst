
window.GovLang = {
    current: 'en',

    t: {
        // Site
        siteName: { en: 'GovCatalyst', mr: 'गव्हकॅटलिस्ट' },
        siteSubtitle: { en: 'Startup-Friendly Innovation Procurement Portal', mr: 'स्टार्टअप-अनुकूल नवोपक्रम खरेदी पोर्टल' },
        govName: { en: 'Government of Maharashtra', mr: 'महाराष्ट्र शासन' },
        officialSite: { en: 'Official Portal', mr: 'अधिकृत संकेतस्थळ' },
        skipContent: { en: 'Skip to Main Content', mr: 'मुख्य सामग्रीवर जा' },
        screenReader: { en: 'Screen Reader Access', mr: 'स्क्रीन रीडर' },

        // Navigation
        home: { en: 'Home', mr: 'मुख्यपृष्ठ' },
        challenges: { en: 'Challenges', mr: 'आव्हाने' },
        startups: { en: 'Startups', mr: 'स्टार्टअप्स' },
        eligibility: { en: 'Eligibility', mr: 'पात्रता' },
        evaluation: { en: 'Evaluation', mr: 'मूल्यांकन' },
        pilotDesign: { en: 'Pilot Design', mr: 'प्रायोगिक रचना' },
        milestones: { en: 'Milestones', mr: 'टप्पे' },
        performance: { en: 'Performance', mr: 'कामगिरी' },
        payments: { en: 'Payments', mr: 'देयके' },
        scaleup: { en: 'Scale-up', mr: 'विस्तार' },
        admin: { en: 'Admin', mr: 'प्रशासन' },

        // Common UI
        search: { en: 'Search', mr: 'शोधा' },
        searchHere: { en: 'Search here...', mr: 'येथे शोधा...' },
        submit: { en: 'Submit', mr: 'सादर करा' },
        save: { en: 'Save', mr: 'जतन करा' },
        cancel: { en: 'Cancel', mr: 'रद्द करा' },
        view: { en: 'View', mr: 'पहा' },
        edit: { en: 'Edit', mr: 'संपादन' },
        delete: { en: 'Delete', mr: 'हटवा' },
        status: { en: 'Status', mr: 'स्थिती' },
        department: { en: 'Department', mr: 'विभाग' },
        actions: { en: 'Actions', mr: 'क्रिया' },
        total: { en: 'Total', mr: 'एकूण' },
        welcome: { en: 'Welcome to Maharashtra', mr: 'महाराष्ट्रात आपले स्वागत आहे' },
        trendSearch: { en: 'Trending :', mr: 'लोकप्रिय :' },

        // Footer
        quickLinks: { en: 'Quick Links', mr: 'जलद दुवे' },
        legal: { en: 'Legal', mr: 'कायदेशीर' },
        copyright: { en: '© 2026 Government of Maharashtra. All rights reserved.', mr: '© २०२६ महाराष्ट्र शासन. सर्व हक्क राखीव.' },
    },

    get(key) {
        const entry = this.t[key];
        return entry ? (entry[this.current] || entry['en']) : key;
    },

    toggle() {
        this.current = this.current === 'en' ? 'mr' : 'en';
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            el.textContent = this.get(el.dataset.langKey);
        });
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            el.placeholder = this.get(el.dataset.langPlaceholder);
        });
        document.querySelectorAll('.lang-toggle button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.current);
        });
    }
};


// ============================================
// SECTION 2: MOCK DATA FOR ALL 10 MODULES
// ============================================
window.GovData = {

    // --- MODULE 1: CHALLENGES ---
    challenges: [
        { id: 'CH-001', title: 'AI-Powered Highway Infrastructure Inspection', department: 'Public Works Department (PWD)', description: 'Manual visual inspection of concrete bridges and highway overpasses is slow, hazardous, and takes an average of 10 hours per bridge deck with subjective error rates.', outcomeStatement: 'Reduce bridge inspection time by at least 40% (from 10 hrs to 6 hrs or less) while maintaining defect detection accuracy above 90%, measured over 100 inspection cases across 3 bridge sites within 8 weeks.', category: 'AI/ML', status: 'Matched', createdDate: '2026-04-15', templateUsed: 'T3' },
        { id: 'CH-002', title: 'Smart Water Leakage Detection System', department: 'Water Supply & Sanitation Dept', description: 'Urban water supply networks experience 30-40% water loss due to undetected pipeline leakages. Current detection methods rely on citizen complaints and are reactive.', outcomeStatement: 'Achieve leak detection rate of 85% or above with response time under 4 hours, deployed across Pune Municipal Corporation pilot zone within 12 weeks.', category: 'IoT', status: 'Published', createdDate: '2026-05-20', templateUsed: 'T1' },
        { id: 'CH-003', title: 'Digital Land Record Verification Portal', department: 'Revenue & Forest Department', description: 'Land record verification takes 15-20 days involving multiple office visits. Citizens face difficulty in verifying property ownership and encumbrance status.', outcomeStatement: 'Enable online land record verification within 48 hours with 95% data accuracy, reducing citizen visits from 4 to 0 for standard verification requests.', category: 'Software', status: 'Draft', createdDate: '2026-06-10', templateUsed: 'T1' },
        { id: 'CH-004', title: 'AI Chatbot for Citizen Grievance Redressal', department: 'General Administration Department', description: 'The CM Helpline receives 50,000+ calls daily. Average resolution time is 7 days. Many queries are repetitive and can be auto-resolved.', outcomeStatement: 'Auto-resolve 60% of routine citizen queries within 2 minutes using AI chatbot, reducing call center load by 40% and improving citizen satisfaction score from 3.2 to 4.0 (out of 5).', category: 'AI/ML', status: 'Published', createdDate: '2026-07-01', templateUsed: 'T4' }
    ],

    challengeTemplates: [
        { id: 'T1', name: 'Digital Service Delivery', template: 'The department seeks a solution that can [DESCRIBE OUTCOME] within [TIMEFRAME], measured by [KPI METRIC], improving from a baseline of [BASELINE VALUE] to a target of [TARGET VALUE], serving [TARGET USERS] across [DEPLOYMENT SCOPE].' },
        { id: 'T2', name: 'Process Automation', template: 'The department requires automation of [PROCESS NAME] which currently takes [CURRENT TIME/EFFORT]. The solution should reduce processing time by [X%] while maintaining [QUALITY METRIC] above [THRESHOLD], tested over [SAMPLE SIZE] cases.' },
        { id: 'T3', name: 'Data Analytics & AI', template: 'The department needs an AI/ML-based solution for [USE CASE] that can achieve [ACCURACY/PERFORMANCE METRIC] of [TARGET VALUE] or above, processing [DATA VOLUME] within [TIME CONSTRAINT], validated against [BENCHMARK].' },
        { id: 'T4', name: 'Citizen Engagement', template: 'The department seeks a citizen-facing solution for [SERVICE AREA] that improves [CITIZEN METRIC] from [BASELINE] to [TARGET], reduces [FRICTION METRIC] by [X%], and serves [DAILY VOLUME] interactions within [DEPLOYMENT SCOPE].' }
    ],

    // --- MODULE 2: STARTUPS ---
    startups: [
        { id: 'SU-001', name: 'InspectAI Technologies Pvt Ltd', sector: 'AI/ML', stage: 'Growth', techStack: ['Python', 'TensorFlow', 'OpenCV', 'Drone SDK', 'React'], pastPilots: 3, dpiitNumber: 'DIPP-2023-MH-45821', gemRegistered: true, founders: 'Dr. Vikram Sen, Anita Kulkarni', city: 'Pune', description: 'AI-powered infrastructure inspection using drone-based computer vision for defect detection in bridges, highways, and buildings.', matchTags: ['ai', 'ml', 'infrastructure', 'inspection', 'drones', 'computer-vision'], turnover: 5200000, teamSize: 18, founded: '2022' },
        { id: 'SU-002', name: 'AquaSense IoT Solutions', sector: 'IoT', stage: 'Early', techStack: ['Arduino', 'LoRaWAN', 'Node.js', 'MongoDB', 'React Native'], pastPilots: 1, dpiitNumber: 'DIPP-2024-MH-61234', gemRegistered: false, founders: 'Rohan Deshmukh, Meera Joshi', city: 'Nagpur', description: 'IoT-based smart water monitoring and leakage detection system using acoustic sensors and ML algorithms for municipal water networks.', matchTags: ['iot', 'water', 'smart-city', 'sensors', 'monitoring'], turnover: 1800000, teamSize: 10, founded: '2023' },
        { id: 'SU-003', name: 'LandChain Digital Pvt Ltd', sector: 'Blockchain', stage: 'Seed', techStack: ['Solidity', 'Hyperledger', 'React', 'PostgreSQL', 'Go'], pastPilots: 0, dpiitNumber: 'DIPP-2024-MH-72456', gemRegistered: false, founders: 'Aditya Patil', city: 'Mumbai', description: 'Blockchain-based land record management and verification platform ensuring tamper-proof property documentation.', matchTags: ['blockchain', 'land-records', 'verification', 'digital', 'governance'], turnover: 800000, teamSize: 6, founded: '2024' },
        { id: 'SU-004', name: 'NagriBot AI Pvt Ltd', sector: 'AI/ML', stage: 'Early', techStack: ['Python', 'GPT API', 'FastAPI', 'React', 'Redis'], pastPilots: 2, dpiitNumber: 'DIPP-2023-MH-51890', gemRegistered: true, founders: 'Prashant Shirke, Sneha Wagh', city: 'Pune', description: 'Multilingual AI chatbot platform for government citizen services with Marathi, Hindi, and English support.', matchTags: ['ai', 'chatbot', 'citizen', 'nlp', 'multilingual', 'grievance'], turnover: 3500000, teamSize: 12, founded: '2023' },
        { id: 'SU-005', name: 'GreenGrid CleanTech', sector: 'CleanTech', stage: 'Growth', techStack: ['Python', 'IoT Sensors', 'AWS', 'Angular', 'PostgreSQL'], pastPilots: 4, dpiitNumber: 'DIPP-2022-MH-38901', gemRegistered: true, founders: 'Dr. Sanjay More, Kavita Raut', city: 'Nashik', description: 'Solar microgrid and energy management solutions for rural government buildings and panchayat offices.', matchTags: ['cleantech', 'solar', 'energy', 'rural', 'green'], turnover: 12000000, teamSize: 25, founded: '2021' },
        { id: 'SU-006', name: 'EduSpark Technologies', sector: 'EdTech', stage: 'Scale', techStack: ['Flutter', 'Django', 'PostgreSQL', 'ML Models', 'AWS'], pastPilots: 5, dpiitNumber: 'DIPP-2021-MH-22345', gemRegistered: true, founders: 'Amita Bhosale, Rajiv Kadam', city: 'Aurangabad', description: 'Adaptive learning platform for government schools with personalized content delivery in Marathi medium.', matchTags: ['edtech', 'education', 'schools', 'adaptive-learning', 'marathi'], turnover: 20000000, teamSize: 35, founded: '2020' }
    ],

    // --- MODULE 3: ELIGIBILITY ---
    eligibilityCriteria: [
        { id: 'EC-1', name: 'Annual Turnover', standardThreshold: '₹10 Crore minimum', relaxedThreshold: '₹25 Lakh minimum (Startup India)', description: 'Minimum annual turnover requirement for vendor qualification', exemptionApplicable: true },
        { id: 'EC-2', name: 'Years of Operation', standardThreshold: '5+ years', relaxedThreshold: '1+ year with working prototype', description: 'Minimum years of business operation', exemptionApplicable: true },
        { id: 'EC-3', name: 'DPIIT Recognition', standardThreshold: 'Not Required', relaxedThreshold: 'Mandatory — valid DPIIT certificate', description: 'Recognition under Startup India initiative', exemptionApplicable: false },
        { id: 'EC-4', name: 'Prototype / MVP Readiness', standardThreshold: 'Not Applicable', relaxedThreshold: 'Working prototype or MVP demo mandatory', description: 'Demonstration of functional product/prototype', exemptionApplicable: false },
        { id: 'EC-5', name: 'Team Credentials', standardThreshold: 'Certified professionals required', relaxedThreshold: 'Technical co-founder with domain expertise', description: 'Key team qualifications and experience', exemptionApplicable: true },
        { id: 'EC-6', name: 'Past Government Projects', standardThreshold: '3+ govt contracts completed', relaxedThreshold: '1 pilot or industry reference letter', description: 'Prior experience with government/enterprise clients', exemptionApplicable: true }
    ],

    startupScreenings: [
        {
            startupId: 'SU-001', results: [
                { criterionId: 'EC-1', met: true, value: '₹52 Lakh', notes: 'Meets relaxed criteria' },
                { criterionId: 'EC-2', met: true, value: '4 years', notes: 'Operating since 2022' },
                { criterionId: 'EC-3', met: true, value: 'DIPP-2023-MH-45821', notes: 'Valid DPIIT certificate' },
                { criterionId: 'EC-4', met: true, value: 'Production Ready', notes: 'Deployed with 3 clients' },
                { criterionId: 'EC-5', met: true, value: 'PhD in CV, 18-member team', notes: 'CTO holds AI/ML doctorate' },
                { criterionId: 'EC-6', met: true, value: '3 govt pilots completed', notes: 'NHAI, MSRDC, BMC' }
            ], overallStatus: 'ELIGIBLE'
        },
        {
            startupId: 'SU-002', results: [
                { criterionId: 'EC-1', met: true, value: '₹18 Lakh', notes: 'Below standard, meets relaxed' },
                { criterionId: 'EC-2', met: true, value: '3 years', notes: 'Operating since 2023' },
                { criterionId: 'EC-3', met: true, value: 'DIPP-2024-MH-61234', notes: 'Valid DPIIT certificate' },
                { criterionId: 'EC-4', met: true, value: 'MVP Deployed', notes: 'Pilot running in Nagpur' },
                { criterionId: 'EC-5', met: true, value: 'IoT engineer founders', notes: 'IIT Bombay alumni' },
                { criterionId: 'EC-6', met: false, value: '1 pilot (ongoing)', notes: 'No completed govt project' }
            ], overallStatus: 'ELIGIBLE'
        },
        {
            startupId: 'SU-003', results: [
                { criterionId: 'EC-1', met: false, value: '₹8 Lakh', notes: 'Below relaxed threshold' },
                { criterionId: 'EC-2', met: true, value: '2 years', notes: 'Operating since 2024' },
                { criterionId: 'EC-3', met: true, value: 'DIPP-2024-MH-72456', notes: 'Valid certificate' },
                { criterionId: 'EC-4', met: true, value: 'Prototype', notes: 'Working demo available' },
                { criterionId: 'EC-5', met: false, value: 'Solo founder', notes: 'No dedicated CTO' },
                { criterionId: 'EC-6', met: false, value: 'None', notes: 'No prior govt experience' }
            ], overallStatus: 'NOT ELIGIBLE'
        },
        {
            startupId: 'SU-004', results: [
                { criterionId: 'EC-1', met: true, value: '₹35 Lakh', notes: 'Meets relaxed criteria' },
                { criterionId: 'EC-2', met: true, value: '3 years', notes: 'Operating since 2023' },
                { criterionId: 'EC-3', met: true, value: 'DIPP-2023-MH-51890', notes: 'Valid certificate' },
                { criterionId: 'EC-4', met: true, value: 'Production', notes: 'Live chatbot with 2 clients' },
                { criterionId: 'EC-5', met: true, value: 'NLP specialists, 12 team', notes: 'Strong AI team' },
                { criterionId: 'EC-6', met: true, value: '2 govt pilots', notes: 'PMC, Collector Office' }
            ], overallStatus: 'ELIGIBLE'
        }
    ],

    // --- MODULE 4: EVALUATION ---
    evaluators: [
        { id: 'EV-001', name: 'Dr. Priya Sharma', expertise: 'AI/ML & Computer Vision', department: 'IT Department', coiDeclared: false, coiDetails: '' },
        { id: 'EV-002', name: 'Shri Amit Patel', expertise: 'Infrastructure & Civil Engineering', department: 'PWD', coiDeclared: true, coiDetails: 'Advisory board member of SU-005 (GreenGrid)' },
        { id: 'EV-003', name: 'Dr. Sunita Rao', expertise: 'Policy & Public Administration', department: 'GAD', coiDeclared: false, coiDetails: '' }
    ],

        evaluationRubric: [
        { category: 'Technical Feasibility', weight: 25, maxScore: 10, description: 'Technical and operational feasibility within government infrastructure constraints' },
        { category: 'Innovation & Novelty', weight: 20, maxScore: 10, description: 'Novelty of approach, technology differentiation, and creative problem solving' },
        { category: 'Alignment with Outcomes', weight: 25, maxScore: 10, description: 'Direct alignment with departmental problem statement and measurable baseline targets' },
        { category: 'Cost Effectiveness', weight: 15, maxScore: 10, description: 'Value for money, total cost of ownership, and budget efficiency' },
        { category: 'Scalability & Replication', weight: 15, maxScore: 10, description: 'Ability to scale across multiple departments, 36 districts, and state agencies' }
    ],

    evaluationScores: [
        { startupId: 'SU-001', challengeId: 'CH-001', evaluatorId: 'EV-001', scores: { innovation: 9, feasibility: 8, scalability: 7, cost: 8 }, comments: 'Excellent AI model accuracy. Strong drone integration. Good cost-value ratio.' },
        { startupId: 'SU-001', challengeId: 'CH-001', evaluatorId: 'EV-003', scores: { innovation: 8, feasibility: 9, scalability: 8, cost: 7 }, comments: 'Well-aligned with government infrastructure needs. Scalable approach.' },
        { startupId: 'SU-004', challengeId: 'CH-004', evaluatorId: 'EV-001', scores: { innovation: 8, feasibility: 9, scalability: 9, cost: 8 }, comments: 'Strong NLP capabilities. Marathi language support is critical differentiator.' },
        { startupId: 'SU-004', challengeId: 'CH-004', evaluatorId: 'EV-003', scores: { innovation: 7, feasibility: 8, scalability: 8, cost: 9 }, comments: 'Very cost-effective. Good citizen engagement potential.' },
        { startupId: 'SU-002', challengeId: 'CH-002', evaluatorId: 'EV-001', scores: { innovation: 7, feasibility: 7, scalability: 6, cost: 8 }, comments: 'Good IoT approach but scalability needs improvement.' },
        { startupId: 'SU-002', challengeId: 'CH-002', evaluatorId: 'EV-002', scores: { innovation: 6, feasibility: 8, scalability: 7, cost: 7 }, comments: 'Feasible for municipal deployment. Need larger sensor network for scale.' }
    ],

    // --- MODULE 5: PILOTS ---
    pilots: [
        { id: 'PLT-001', challengeId: 'CH-001', startupId: 'SU-001', name: 'AI Highway Inspection Pilot', duration: '8 weeks', startDate: '2026-06-01', endDate: '2026-07-27', location: 'NH-48 Corridor, Maharashtra (Sector 12, 18, 24 Bridges)', riskLevel: 'Medium', status: 'Completed', kpiTargets: [{ name: 'Inspection Time Reduction', baseline: '10 hrs', target: '6 hrs' }, { name: 'Defect Detection Accuracy', baseline: '82%', target: '90%' }, { name: 'User Satisfaction', baseline: '6/10', target: '8/10' }], dataScope: ['Bridge inspection images', 'GIS asset data', 'Structural assessment reports'], safeguards: ['Dedicated sandbox environment', 'No production data access', 'Weekly security audits', 'Manual verification of AI outputs'], successThresholds: 'All KPIs met with no critical security incidents' },
        { id: 'PLT-002', challengeId: 'CH-002', startupId: 'SU-002', name: 'Smart Water Monitoring Pilot', duration: '12 weeks', startDate: '2026-08-01', endDate: '2026-10-24', location: 'Pune Municipal Corporation — Zone 3', riskLevel: 'Low', status: 'Active', kpiTargets: [{ name: 'Leak Detection Rate', baseline: '40%', target: '85%' }, { name: 'Response Time', baseline: '48 hrs', target: '4 hrs' }], dataScope: ['Water flow sensor data', 'Pipeline network maps'], safeguards: ['IoT device isolation', 'Encrypted data transmission', 'Weekly reviews'], successThresholds: 'Leak detection rate above 75%' }
    ],

    // --- MODULE 6: MILESTONES ---
    milestones: [
        { id: 'MS-001', pilotId: 'PLT-001', name: 'Setup & Agreement', description: 'Complete pilot agreement, configure sandbox, train inspection team', status: 'Completed', dueDate: '2026-06-14', completedDate: '2026-06-12', paymentLinked: true, paymentAmount: 100000 },
        { id: 'MS-002', pilotId: 'PLT-001', name: 'Deployment & Integration', description: 'Deploy AI system, connect GIS APIs, run end-to-end sandbox tests', status: 'Completed', dueDate: '2026-06-28', completedDate: '2026-06-25', paymentLinked: true, paymentAmount: 150000 },
        { id: 'MS-003', pilotId: 'PLT-001', name: 'Active Pilot Execution', description: 'Run 100 bridge inspections, collect KPI data, bi-weekly reviews', status: 'Completed', dueDate: '2026-07-19', completedDate: '2026-07-18', paymentLinked: true, paymentAmount: 150000 },
        { id: 'MS-004', pilotId: 'PLT-001', name: 'Final Evaluation & Report', description: 'Complete evaluation, generate final report, committee review', status: 'Completed', dueDate: '2026-07-27', completedDate: '2026-07-26', paymentLinked: true, paymentAmount: 100000 },
        { id: 'MS-005', pilotId: 'PLT-002', name: 'Sensor Network Deployment', description: 'Install 50 IoT sensors across Zone 3 pipeline network', status: 'Completed', dueDate: '2026-08-15', completedDate: '2026-08-14', paymentLinked: true, paymentAmount: 200000 },
        { id: 'MS-006', pilotId: 'PLT-002', name: 'Data Collection & Calibration', description: 'Collect baseline data, calibrate leak detection algorithms', status: 'In Progress', dueDate: '2026-09-15', completedDate: null, paymentLinked: true, paymentAmount: 200000 },
        { id: 'MS-007', pilotId: 'PLT-002', name: 'Performance Assessment', description: 'Full-scale testing and KPI measurement', status: 'Pending', dueDate: '2026-10-10', completedDate: null, paymentLinked: true, paymentAmount: 200000 },
        { id: 'MS-008', pilotId: 'PLT-002', name: 'Final Report & Decision', description: 'Generate evaluation report and scale-up recommendation', status: 'Pending', dueDate: '2026-10-24', completedDate: null, paymentLinked: true, paymentAmount: 100000 }
    ],

    agreementClauses: [
        { id: 'CL-1', category: 'IP Ownership', text: 'All intellectual property developed during the pilot shall remain with the startup. The Government retains a perpetual, non-exclusive license to use the solution for government purposes.' },
        { id: 'CL-2', category: 'Data Rights', text: 'Government data used during the pilot remains government property. The startup shall not retain, copy, or use government data beyond the pilot scope without written approval.' },
        { id: 'CL-3', category: 'Cybersecurity', text: 'The startup must comply with CERT-In guidelines and pass a security assessment before deployment. All data must be encrypted at rest (AES-256) and in transit (TLS 1.3).' },
        { id: 'CL-4', category: 'Liability & Indemnity', text: 'The startup shall indemnify the Government against any losses arising from system failures, data breaches, or regulatory non-compliance during the pilot period.' },
        { id: 'CL-5', category: 'Termination', text: 'Either party may terminate the pilot with 14 days written notice. All government data must be returned and securely deleted (NIST 800-88) within 7 days of termination.' },
        { id: 'CL-6', category: 'Confidentiality', text: 'Both parties shall maintain strict confidentiality of all shared information for a period of 3 years beyond pilot completion, subject to RTI Act provisions.' }
    ],

    // --- MODULE 7: KPI READINGS ---
    kpiReadings: [
        { id: 'KPI-001', pilotId: 'PLT-001', name: 'Inspection Time', unit: 'hours', baseline: 10, target: 6, current: 5.8, minAcceptable: 7, readings: [{ week: 1, value: 9.5 }, { week: 2, value: 8.2 }, { week: 3, value: 7.1 }, { week: 4, value: 6.5 }, { week: 5, value: 6.1 }, { week: 6, value: 5.9 }, { week: 7, value: 5.8 }, { week: 8, value: 5.8 }], direction: 'lower', status: 'Achieved' },
        { id: 'KPI-002', pilotId: 'PLT-001', name: 'Defect Detection Accuracy', unit: '%', baseline: 82, target: 90, current: 91, minAcceptable: 85, readings: [{ week: 1, value: 83 }, { week: 2, value: 85 }, { week: 3, value: 87 }, { week: 4, value: 88 }, { week: 5, value: 89 }, { week: 6, value: 90 }, { week: 7, value: 91 }, { week: 8, value: 91 }], direction: 'higher', status: 'Achieved' },
        { id: 'KPI-003', pilotId: 'PLT-001', name: 'User Satisfaction Score', unit: '/10', baseline: 6, target: 8, current: 8.5, minAcceptable: 7, readings: [{ week: 1, value: 6.2 }, { week: 2, value: 6.8 }, { week: 3, value: 7.2 }, { week: 4, value: 7.5 }, { week: 5, value: 7.8 }, { week: 6, value: 8.1 }, { week: 7, value: 8.3 }, { week: 8, value: 8.5 }], direction: 'higher', status: 'Achieved' },
        { id: 'KPI-004', pilotId: 'PLT-002', name: 'Leak Detection Rate', unit: '%', baseline: 40, target: 85, current: 62, minAcceptable: 60, readings: [{ week: 1, value: 42 }, { week: 2, value: 48 }, { week: 3, value: 55 }, { week: 4, value: 62 }], direction: 'higher', status: 'On Track' },
        { id: 'KPI-005', pilotId: 'PLT-002', name: 'Response Time', unit: 'hours', baseline: 48, target: 4, current: 12, minAcceptable: 8, readings: [{ week: 1, value: 44 }, { week: 2, value: 32 }, { week: 3, value: 20 }, { week: 4, value: 12 }], direction: 'lower', status: 'On Track' }
    ],

    // --- MODULE 8: PAYMENTS ---
    payments: [
        { id: 'PAY-001', milestoneId: 'MS-001', pilotId: 'PLT-001', amount: 100000, status: 'Released', requestDate: '2026-06-13', approvalDate: '2026-06-14', releaseDate: '2026-06-16', escrowHeld: false },
        { id: 'PAY-002', milestoneId: 'MS-002', pilotId: 'PLT-001', amount: 150000, status: 'Released', requestDate: '2026-06-26', approvalDate: '2026-06-27', releaseDate: '2026-06-30', escrowHeld: false },
        { id: 'PAY-003', milestoneId: 'MS-003', pilotId: 'PLT-001', amount: 150000, status: 'Released', requestDate: '2026-07-19', approvalDate: '2026-07-20', releaseDate: '2026-07-22', escrowHeld: false },
        { id: 'PAY-004', milestoneId: 'MS-004', pilotId: 'PLT-001', amount: 100000, status: 'Released', requestDate: '2026-07-27', approvalDate: '2026-07-28', releaseDate: '2026-07-30', escrowHeld: false },
        { id: 'PAY-005', milestoneId: 'MS-005', pilotId: 'PLT-002', amount: 200000, status: 'Released', requestDate: '2026-08-15', approvalDate: '2026-08-16', releaseDate: '2026-08-18', escrowHeld: false },
        { id: 'PAY-006', milestoneId: 'MS-006', pilotId: 'PLT-002', amount: 200000, status: 'In Escrow', requestDate: null, approvalDate: null, releaseDate: null, escrowHeld: true },
        { id: 'PAY-007', milestoneId: 'MS-007', pilotId: 'PLT-002', amount: 200000, status: 'Pending', requestDate: null, approvalDate: null, releaseDate: null, escrowHeld: true },
        { id: 'PAY-008', milestoneId: 'MS-008', pilotId: 'PLT-002', amount: 100000, status: 'Pending', requestDate: null, approvalDate: null, releaseDate: null, escrowHeld: true }
    ],

    // --- MODULE 9: SCALE-UP ---
    scaleupDecisions: [
        { pilotId: 'PLT-001', successScore: 92, recommendation: 'Scale to Full Procurement', reasoning: 'All 3 KPIs exceeded targets. Inspection time reduced by 42% (target was 40%). Defect accuracy 91% (target 90%). User satisfaction 8.5/10 (target 8). No critical security or safety incidents. Strong user adoption across all 10 engineers.', procurementPathway: 'GFR Rule 194 — Innovation Procurement Framework', gemListingDraft: { itemName: 'AI-Powered Infrastructure Inspection System', category: 'Software — AI/ML Solutions', estimatedValue: '₹2.5 Crore', specifications: 'Drone-based computer vision defect detection for bridge and highway inspection. Includes edge AI processing, GIS integration, and automated reporting.' }, transitionSteps: ['Complete final validator sign-off', 'Prepare GeM listing draft', 'Submit to department procurement committee', 'Issue RFP under GFR Rule 194', 'Contract award and phased deployment across 12 highway divisions'] },
        { pilotId: 'PLT-002', successScore: null, recommendation: 'Pilot In Progress', reasoning: 'Pilot is currently active (Week 4 of 12). KPIs showing positive trends. Decision pending pilot completion in October 2026.', procurementPathway: null, gemListingDraft: null, transitionSteps: [] }
    ],

    // --- MODULE 10: ADMIN & GOVERNANCE ---
    users: [
        { id: 'USR-001', name: 'Shri Rajesh Verma', role: 'Dept Admin', email: 'rajesh.verma@maharashtra.gov.in', department: 'PWD', lastLogin: '2026-08-27 09:15', status: 'Active' },
        { id: 'USR-002', name: 'Dr. Vikram Sen', role: 'Startup', email: 'vikram@inspectai.com', department: 'InspectAI Technologies', lastLogin: '2026-08-26 16:30', status: 'Active' },
        { id: 'USR-003', name: 'Dr. Priya Sharma', role: 'Evaluator', email: 'priya.sharma@maharashtra.gov.in', department: 'IT Department', lastLogin: '2026-08-25 11:00', status: 'Active' },
        { id: 'USR-004', name: 'Shri Amit Patel', role: 'Evaluator', email: 'amit.patel@maharashtra.gov.in', department: 'PWD', lastLogin: '2026-08-24 14:20', status: 'Active' },
        { id: 'USR-005', name: 'Smt. Kavita Deshmukh', role: 'Validator', email: 'kavita.d@maharashtra.gov.in', department: 'Finance Department', lastLogin: '2026-08-27 10:00', status: 'Active' },
        { id: 'USR-006', name: 'Shri Anil Kumar', role: 'Super Admin', email: 'anil.kumar@maharashtra.gov.in', department: 'MSInS', lastLogin: '2026-08-27 08:45', status: 'Active' }
    ],

    // Super Admin NOT available in registration — pre-seeded only
    roleDefinitions: [
        { role: 'Super Admin', permissions: ['All modules', 'User management', 'System configuration', 'Audit access', 'Role assignment'], description: 'Full system access — pre-configured, not available in registration', registerable: false },
        { role: 'Dept Admin', permissions: ['Challenge creation', 'Pilot management', 'Payment approval', 'Reports', 'User viewing'], description: 'Department-level administration and pilot oversight', registerable: true },
        { role: 'Evaluator', permissions: ['Evaluation scoring', 'Startup review', 'COI declaration', 'Report viewing'], description: 'Expert evaluation and scoring for startup proposals', registerable: true },
        { role: 'Startup', permissions: ['Profile management', 'Challenge application', 'Milestone submission', 'Evidence upload', 'Payment tracking'], description: 'Startup participant with self-service access', registerable: true },
        { role: 'Validator', permissions: ['Audit trail review', 'Sign-off workflow', 'Compliance verification', 'Financial audit'], description: 'Independent validation and audit oversight', registerable: true }
    ],

    auditTrail: [
        { id: 1, timestamp: '2026-08-27 09:15:00', user: 'Shri Rajesh Verma', role: 'Dept Admin', action: 'Login', module: 'System', detail: 'User logged in from IP 192.168.1.100' },
        { id: 2, timestamp: '2026-08-27 09:20:00', user: 'Shri Rajesh Verma', role: 'Dept Admin', action: 'Dashboard View', module: 'Dashboard', detail: 'Accessed main monitoring dashboard' },
        { id: 3, timestamp: '2026-08-26 16:30:00', user: 'Dr. Vikram Sen', role: 'Startup', action: 'Evidence Upload', module: 'Milestones', detail: 'Uploaded sensor calibration report for MS-006' },
        { id: 4, timestamp: '2026-08-26 14:00:00', user: 'Dr. Priya Sharma', role: 'Evaluator', action: 'Score Submission', module: 'Evaluation', detail: 'Submitted evaluation scores for SU-001 against CH-001' },
        { id: 5, timestamp: '2026-08-25 11:30:00', user: 'Smt. Kavita Deshmukh', role: 'Validator', action: 'Sign-off Approved', module: 'Audit', detail: 'Validated and signed off on PLT-001 final evaluation report' },
        { id: 6, timestamp: '2026-08-25 10:00:00', user: 'Shri Anil Kumar', role: 'Super Admin', action: 'User Created', module: 'Admin', detail: 'Created evaluator account for Dr. Sunita Rao (EV-003)' },
        { id: 7, timestamp: '2026-08-24 15:00:00', user: 'Shri Rajesh Verma', role: 'Dept Admin', action: 'Payment Approved', module: 'Payments', detail: 'Approved milestone payment PAY-005 of ₹2,00,000 for MS-005' },
        { id: 8, timestamp: '2026-08-24 09:00:00', user: 'Shri Rajesh Verma', role: 'Dept Admin', action: 'Challenge Published', module: 'Challenges', detail: 'Published challenge CH-002: Smart Water Leakage Detection System' },
        { id: 9, timestamp: '2026-08-23 14:00:00', user: 'Dr. Vikram Sen', role: 'Startup', action: 'Profile Updated', module: 'Startups', detail: 'Updated company profile and added NHAI pilot reference' },
        { id: 10, timestamp: '2026-08-22 11:00:00', user: 'Smt. Kavita Deshmukh', role: 'Validator', action: 'Compliance Check', module: 'Eligibility', detail: 'Verified eligibility screening results for SU-001' },
        { id: 11, timestamp: '2026-08-20 16:00:00', user: 'Shri Anil Kumar', role: 'Super Admin', action: 'Config Change', module: 'Admin', detail: 'Updated eligibility relaxation criteria for Startup India exemptions' },
        { id: 12, timestamp: '2026-08-19 10:30:00', user: 'Dr. Priya Sharma', role: 'Evaluator', action: 'COI Declaration', module: 'Evaluation', detail: 'Declared no conflict of interest for CH-001 evaluation panel' }
    ],

    validatorSignoffs: [
        { id: 'VS-001', pilotId: 'PLT-001', validatorId: 'USR-005', validatorName: 'Smt. Kavita Deshmukh', module: 'Final Evaluation', status: 'Signed Off', signoffDate: '2026-08-25 11:30', comments: 'All processes followed per GFR Rule 194. Documentation complete. Recommend scale-up.' },
        { id: 'VS-002', pilotId: 'PLT-001', validatorId: 'USR-005', validatorName: 'Smt. Kavita Deshmukh', module: 'Financial Audit', status: 'Signed Off', signoffDate: '2026-08-25 12:00', comments: 'All 4 payments verified against milestone completion. Budget ₹5L of ₹5L utilized within approved limits.' },
        { id: 'VS-003', pilotId: 'PLT-002', validatorId: 'USR-005', validatorName: 'Smt. Kavita Deshmukh', module: 'Eligibility Verification', status: 'Signed Off', signoffDate: '2026-08-22 11:00', comments: 'AquaSense IoT eligibility verified under Startup India relaxed criteria.' },
        { id: 'VS-004', pilotId: 'PLT-002', validatorId: 'USR-005', validatorName: 'Smt. Kavita Deshmukh', module: 'Milestone MS-006 Review', status: 'Pending', signoffDate: null, comments: '' }
    ],

    currentRole: 'dept_admin'
};


// ============================================
// SECTION 3: UTILITY FUNCTIONS
// ============================================
window.GovUtils = {

    // Format number as Indian Rupee (₹X,XX,XXX)
    formatCurrency(num) {
        if (num == null) return '—';
        return '₹' + num.toLocaleString('en-IN');
    },

    // Format date string as DD MMM YYYY
    formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    },

    // Show toast notification
    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container-gov');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container-gov';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `gov-toast t-${type}`;
        const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
        toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = '0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    // Open modal
    openModal(title, contentHtml) {
        const overlay = document.getElementById('gov-modal-overlay');
        if (!overlay) return;
        document.getElementById('gov-modal-title').textContent = title;
        document.getElementById('gov-modal-body').innerHTML = contentHtml;
        overlay.classList.add('show');
    },

    // Close modal
    closeModal() {
        const overlay = document.getElementById('gov-modal-overlay');
        if (overlay) overlay.classList.remove('show');
    },

    // Get badge class for status
    getBadgeClass(status) {
        const map = {
            'Draft': 'bg-draft', 'Published': 'bg-published', 'Active': 'bg-active',
            'Completed': 'bg-completed', 'Matched': 'bg-matched', 'Closed': 'bg-closed',
            'Pending': 'bg-pending', 'In Progress': 'bg-inprogress', 'Verified': 'bg-verified',
            'In Escrow': 'bg-escrow', 'Released': 'bg-released', 'Low': 'bg-low',
            'Medium': 'bg-medium', 'High': 'bg-high', 'ELIGIBLE': 'bg-eligible',
            'NOT ELIGIBLE': 'bg-not-eligible', 'Achieved': 'bg-active', 'On Track': 'bg-inprogress',
            'At Risk': 'bg-pending', 'Failed': 'bg-closed', 'Signed Off': 'bg-active',
            'Seed': 'bg-seed', 'Early': 'bg-early', 'Growth': 'bg-growth', 'Scale': 'bg-scale'
        };
        return map[status] || 'bg-draft';
    },

    // Get startup by ID
    getStartup(id) {
        return GovData.startups.find(s => s.id === id);
    },

    // Get challenge by ID
    getChallenge(id) {
        return GovData.challenges.find(c => c.id === id);
    },

    // Get pilot by ID
    getPilot(id) {
        return GovData.pilots.find(p => p.id === id);
    },

    // Calculate weighted evaluation score
    calcWeightedScore(scores) {
        const rubric = GovData.evaluationRubric;
        let total = 0;
        rubric.forEach(r => {
            const cat = r.category.toLowerCase().replace(/ /g, '');
            const key = cat === 'costeffectiveness' ? 'cost' : r.category.toLowerCase().split(' ')[0];
            const score = scores[key] || 0;
            total += (score / r.maxScore) * r.weight;
        });
        return Math.round(total * 10) / 10;
    }
};


// ============================================
// SECTION 4: COMMON PAGE INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    // Inject Exact Full-Screen Mega Menu Overlay (india.gov.in style with GovCatalyst content)
    if (!document.getElementById('gov-mega-menu-overlay')) {
        const megaMenuHtml = `
            <div class="gov-mega-menu-overlay" id="gov-mega-menu-overlay" role="dialog" aria-modal="true" aria-label="Main Navigation Menu">
                <!-- Close Button on Top Right -->
                <button class="gov-mega-close-btn" id="gov-mega-close-btn" aria-label="Close Menu" title="Close Menu">
                    <i class="bi bi-x-lg"></i>
                </button>

                <!-- Multi-Column Category Grid (india.gov.in visual layout with GovCatalyst content) -->
                <div class="gov-mega-grid">
                    <!-- Column 1: Core Procurement Modules (Stage 1 & 2) -->
                    <div class="gov-mega-col">
                        <h3>Innovation Stages</h3>
                        <ul>
                            <li><a href="challenges.html"><strong>01.</strong> Outcome Challenge Builder</a></li>
                            <li><a href="startups.html"><strong>02.</strong> Startup Discovery & Matching</a></li>
                            <li><a href="eligibility.html"><strong>03.</strong> Eligibility & Exemption Screening</a></li>
                            <li><a href="evaluation.html"><strong>04.</strong> Multi-Expert Evaluation Rubric</a></li>
                            <li><a href="pilot-design.html"><strong>05.</strong> Sandbox Pilot Charter & Risks</a></li>
                        </ul>

                        <h4>Framework & Norms</h4>
                        <ul>
                            <li><a href="challenges.html">AI Problem Statement Rewriter</a></li>
                            <li><a href="eligibility.html">Startup India Exemption Engine</a></li>
                            <li><a href="evaluation.html">Conflict of Interest (COI) Detector</a></li>
                            <li><a href="pilot-design.html">Sandbox Risk Safeguards (Low/Med/High)</a></li>
                        </ul>
                    </div>

                    <!-- Column 2: Contracting, M&E & Scale (Stage 3 & 4) -->
                    <div class="gov-mega-col">
                        <h3>Contracting & Scale</h3>
                        <ul>
                            <li><a href="milestones.html"><strong>06.</strong> Milestone Legal Contracting</a></li>
                            <li><a href="performance.html"><strong>07.</strong> Performance M&E Dashboard</a></li>
                            <li><a href="payments.html"><strong>08.</strong> Payment & Escrow Release</a></li>
                            <li><a href="scaleup.html"><strong>09.</strong> Scale-Up & GeM Transition</a></li>
                            <li><a href="admin.html"><strong>10.</strong> Governance & Audit Trail</a></li>
                        </ul>

                        <h4>Execution Tools</h4>
                        <ul>
                            <li><a href="milestones.html">Bilateral Legal Agreement Draft</a></li>
                            <li><a href="performance.html">Live KPI Telemetry & Sparklines</a></li>
                            <li><a href="payments.html">Smart Escrow Financial Ledger</a></li>
                            <li><a href="scaleup.html">GeM Custom Bid Specification Drafter</a></li>
                        </ul>
                    </div>

                    <!-- Column 3: Rules, Regulatory & Directories -->
                    <div class="gov-mega-col">
                        <h3>Rules & Regulatory</h3>
                        <ul>
                            <li><a href="challenges.html">GFR Rule 194 Innovation Norms</a></li>
                            <li><a href="eligibility.html">DPIIT Relaxation Criteria Matrix</a></li>
                            <li><a href="milestones.html">Contract State Machine Model</a></li>
                            <li><a href="admin.html">Section 65B Evidence Compliance</a></li>
                        </ul>

                        <h4>Directory & Network</h4>
                        <ul>
                            <li><a href="admin.html">MSInS Department Officials</a></li>
                            <li><a href="startups.html">DPIIT Registered Startups</a></li>
                            <li><a href="evaluation.html">Independent Expert Evaluators</a></li>
                            <li><a href="admin.html">Third-Party Validators Panel</a></li>
                        </ul>
                    </div>

                    <!-- Column 4: Integration Portals & Resources -->
                    <div class="gov-mega-col">
                        <ul style="margin-bottom: 14px;">
                            <li><a href="scaleup.html" style="font-weight: 700; color: #0f172a; font-size: 15px;">GeM Marketplace Bridge</a></li>
                            <li><a href="startups.html" style="font-weight: 700; color: #0f172a; font-size: 15px;">Startup India API Bridge</a></li>
                        </ul>

                        <h4>Public Resources</h4>
                        <ul>
                            <li><a href="challenges.html">Open Challenge Bulletin</a></li>
                            <li><a href="scaleup.html">Pilot Success Score Leaderboard</a></li>
                            <li><a href="performance.html">Telemetry Baseline Benchmarks</a></li>
                            <li><a href="milestones.html">Procurement Deadlines & Calendar</a></li>
                        </ul>

                        <h4 style="margin-top: 20px;"><a href="admin.html" style="color: #0f172a; text-decoration: none;">Validator Sign-Off Desk</a></h4>
                        <h4><a href="performance.html" style="color: #0f172a; text-decoration: none;">Pilot Health Telemetry</a></h4>
                    </div>

                    <!-- Column 5: Governance & Quick Actions (Rightmost Column) -->
                    <div class="gov-mega-col col-bold-links">
                        <ul>
                            <li><a href="index.html">GovCatalyst Home</a></li>
                            <li><a href="challenges.html">Challenge Builder</a></li>
                            <li><a href="startups.html">Startup Directory</a></li>
                            <li><a href="eligibility.html">Eligibility Matrix</a></li>
                            <li><a href="evaluation.html">Evaluator Workspace</a></li>
                            <li><a href="pilot-design.html">Pilot Charter Builder</a></li>
                            <li><a href="milestones.html">Contracting Stepper</a></li>
                            <li><a href="performance.html">M&E Telemetry</a></li>
                            <li><a href="payments.html">Escrow Release Ledger</a></li>
                            <li><a href="scaleup.html">GeM Spec Generator</a></li>
                            <li><a href="admin.html">Governance & Audit Logs</a></li>
                            <li><a href="admin.html">Role-Based Access (RBAC)</a></li>
                            <li><a href="challenges.html">GFR 194 Policy Guide</a></li>
                            <li><a href="admin.html">Validator Sign-Offs</a></li>
                            <li><a href="admin.html">Help & Documentation</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', megaMenuHtml);
    }

    // Mega Menu Open / Close Logic
    const hamburgerBtn = document.getElementById('gov-hamburger-toggle');
    const megaMenu = document.getElementById('gov-mega-menu-overlay');
    const megaCloseBtn = document.getElementById('gov-mega-close-btn');

    function openMegaMenu() {
        if (hamburgerBtn) hamburgerBtn.classList.add('active');
        if (megaMenu) megaMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMegaMenu() {
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        if (megaMenu) megaMenu.classList.remove('show');
        document.body.style.overflow = '';
    }

    function toggleMegaMenu() {
        if (megaMenu && megaMenu.classList.contains('show')) {
            closeMegaMenu();
        } else {
            openMegaMenu();
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMegaMenu();
        });
    }

    if (megaCloseBtn) {
        megaCloseBtn.addEventListener('click', closeMegaMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && megaMenu && megaMenu.classList.contains('show')) {
            closeMegaMenu();
        }
    });

    // Highlight active nav links on main nav menu
    document.querySelectorAll('.gov-nav .nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Language toggle
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
        btn.addEventListener('click', () => {
            GovLang.current = btn.dataset.lang;
            GovLang.toggle();
        });
    });

    // Top glyph language toggle (अ/A)
    const topLangBtn = document.getElementById('top-lang-toggle');
    if (topLangBtn) {
        topLangBtn.addEventListener('click', () => {
            GovLang.current = GovLang.current === 'en' ? 'mr' : 'en';
            GovLang.toggle();
            GovUtils.showToast(GovLang.current === 'mr' ? 'भाषा: मराठी निवडली' : 'Language: English Selected', 'info');
        });
    }

    // Modal close
    const modalOverlay = document.getElementById('gov-modal-overlay');
    if (modalOverlay) {
        document.getElementById('gov-modal-close')?.addEventListener('click', GovUtils.closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) GovUtils.closeModal();
        });
    }

    // Accessibility Font Resizer (A- / A / A+)
    let currentFontSizePercent = 100;
    const fontDecBtn = document.getElementById('font-dec');
    const fontResetBtn = document.getElementById('font-reset');
    const fontIncBtn = document.getElementById('font-inc');

    if (fontDecBtn) {
        fontDecBtn.addEventListener('click', () => {
            if (currentFontSizePercent > 85) {
                currentFontSizePercent -= 5;
                document.documentElement.style.fontSize = currentFontSizePercent + '%';
            }
        });
    }
    if (fontResetBtn) {
        fontResetBtn.addEventListener('click', () => {
            currentFontSizePercent = 100;
            document.documentElement.style.fontSize = '100%';
        });
    }
    if (fontIncBtn) {
        fontIncBtn.addEventListener('click', () => {
            if (currentFontSizePercent < 125) {
                currentFontSizePercent += 5;
                document.documentElement.style.fontSize = currentFontSizePercent + '%';
            }
        });
    }

    // Hero Search Handler
    const heroSearchBtn = document.getElementById('hero-search-btn');
    const heroSearchInput = document.getElementById('hero-search');
    const heroSearchCat = document.getElementById('hero-search-cat');

    function performHeroSearch() {
        if (!heroSearchInput) return;
        const query = (heroSearchInput.value || '').trim();
        const category = heroSearchCat ? heroSearchCat.value : 'all';

        if (category !== 'all') {
            window.location.href = category + (query ? `?q=${encodeURIComponent(query)}` : '');
        } else if (query) {
            // Smart keyword router
            const qLower = query.toLowerCase();
            if (qLower.includes('startup') || qLower.includes('company') || qLower.includes('innovator')) {
                window.location.href = `startups.html?q=${encodeURIComponent(query)}`;
            } else if (qLower.includes('eligib') || qLower.includes('relax') || qLower.includes('exemption')) {
                window.location.href = `eligibility.html?q=${encodeURIComponent(query)}`;
            } else if (qLower.includes('eval') || qLower.includes('rubric') || qLower.includes('score')) {
                window.location.href = `evaluation.html?q=${encodeURIComponent(query)}`;
            } else if (qLower.includes('pilot') || qLower.includes('charter') || qLower.includes('sandbox')) {
                window.location.href = `pilot-design.html?q=${encodeURIComponent(query)}`;
            } else if (qLower.includes('milestone') || qLower.includes('contract') || qLower.includes('agreement')) {
                window.location.href = `milestones.html?q=${encodeURIComponent(query)}`;
            } else if (qLower.includes('perf') || qLower.includes('kpi') || qLower.includes('telemetry')) {
                window.location.href = `performance.html?q=${encodeURIComponent(query)}`;
            } else if (qLower.includes('pay') || qLower.includes('escrow') || qLower.includes('release')) {
                window.location.href = `payments.html?q=${encodeURIComponent(query)}`;
            } else if (qLower.includes('scale') || qLower.includes('gem') || qLower.includes('transition')) {
                window.location.href = `scaleup.html?q=${encodeURIComponent(query)}`;
            } else if (qLower.includes('admin') || qLower.includes('audit') || qLower.includes('rbac')) {
                window.location.href = `admin.html?q=${encodeURIComponent(query)}`;
            } else {
                window.location.href = `challenges.html?q=${encodeURIComponent(query)}`;
            }
        } else {
            window.location.href = 'challenges.html';
        }
    }

    if (heroSearchBtn) heroSearchBtn.addEventListener('click', performHeroSearch);
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') performHeroSearch();
        });
    }

    // Collapsible sections
    document.querySelectorAll('.collapsible-hdr').forEach(hdr => {
        hdr.addEventListener('click', () => {
            hdr.classList.toggle('open');
            const body = hdr.nextElementSibling;
            if (body) body.classList.toggle('open');
        });
    });

    // ============================================
    // Hero Background Image Transforming Slider
    // ============================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-slider-dot');
    const locationText = document.getElementById('hero-location-text');

    if (heroSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval = null;

        function updateSlideLocation(index) {
            if (!locationText) return;
            const slide = heroSlides[index];
            if (!slide) return;
            const locKey = GovLang.current === 'mr' ? 'locationMr' : 'locationEn';
            const loc = slide.dataset[locKey] || slide.dataset.locationEn || 'Maharashtra';
            locationText.style.opacity = '0';
            setTimeout(() => {
                locationText.textContent = loc;
                locationText.style.opacity = '1';
            }, 300);
        }

        function showSlide(index) {
            heroSlides.forEach((s, idx) => {
                s.classList.toggle('active', idx === index);
            });
            heroDots.forEach((d, idx) => {
                d.classList.toggle('active', idx === index);
            });
            currentSlide = index;
            updateSlideLocation(index);
        }

        function nextSlide() {
            const next = (currentSlide + 1) % heroSlides.length;
            showSlide(next);
        }

        // Initialize first slide location
        updateSlideLocation(0);

        // Auto cycle slides every 5.5 seconds
        slideInterval = setInterval(nextSlide, 5500);

        // Allow manual dot clicking
        heroDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                clearInterval(slideInterval);
                const idx = parseInt(e.target.dataset.index, 10);
                showSlide(idx);
                slideInterval = setInterval(nextSlide, 5500);
            });
        });

        // Re-update location name on language toggle
        document.querySelectorAll('.lang-toggle button').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => updateSlideLocation(currentSlide), 50);
            });
        });
    }

    // ============================================
    // Red Showcase Carousel Interactive Slider
    // ============================================
    const showcaseCardsRow = document.querySelector('.showcase-cards-row');
    const carouselSquareBtn = document.querySelector('.carousel-square-btn');
    const carouselDots = document.querySelectorAll('.carousel-dots-red span');

    if (showcaseCardsRow && carouselSquareBtn) {
        const showcaseData = [
            [
                { href: 'pilot-design.html', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500', title: 'Sandbox Pilot Charter with Risk Safeguards...' },
                { href: 'milestones.html', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500', title: 'Milestone Legal Contracting & State Machine...' },
                { href: 'scaleup.html', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500', title: 'GeM Scale-Up Specification Drafter & Transition...' }
            ],
            [
                { href: 'challenges.html', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500', title: 'Outcome-Based Departmental Problem Statement Builder...' },
                { href: 'startups.html', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500', title: 'DPIIT Startup Discovery & Similarity Matching Engine...' },
                { href: 'evaluation.html', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500', title: 'Multi-Expert Consensus Rubric & COI Detector...' }
            ],
            [
                { href: 'performance.html', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', title: 'Live Field Telemetry & SLA Compliance Engine...' },
                { href: 'payments.html', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500', title: 'Smart Escrow Tranche Disbursement Ledger...' },
                { href: 'admin.html', img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500', title: 'Section 65B Audit Trail & Third-Party Validator Sign-Off...' }
            ]
        ];

        let currentShowcasePage = 0;

        function renderShowcasePage(pageIndex) {
            currentShowcasePage = pageIndex % showcaseData.length;
            const items = showcaseData[currentShowcasePage];
            showcaseCardsRow.style.opacity = '0';
            showcaseCardsRow.style.transition = 'opacity 0.2s ease';
            setTimeout(() => {
                showcaseCardsRow.innerHTML = items.map(it => `
                    <a href="${it.href}" class="showcase-card">
                        <img src="${it.img}" alt="${it.title}" class="showcase-card-img">
                        <div class="showcase-card-body">${it.title}</div>
                    </a>
                `).join('');
                showcaseCardsRow.style.opacity = '1';
            }, 180);

            carouselDots.forEach((dot, idx) => {
                dot.className = idx === currentShowcasePage ? 'dot-red' : 'dot-gray';
            });
        }

        carouselSquareBtn.addEventListener('click', () => {
            renderShowcasePage(currentShowcasePage + 1);
            GovUtils.showToast(`Procurement Showcase ${currentShowcasePage + 1} Loaded`, 'info');
        });

        carouselDots.forEach((dot, idx) => {
            dot.style.cursor = 'pointer';
            dot.addEventListener('click', () => renderShowcasePage(idx));
        });
    }
});
