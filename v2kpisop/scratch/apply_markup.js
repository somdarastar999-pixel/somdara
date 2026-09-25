const fs = require('fs');
const path = require('path');

const targetFile = 'c:\\Users\\user\\OneDrive\\V2 Education TK\\v2kpisop\\index.html';
let content = fs.readFileSync(targetFile, 'utf8');

console.log('Original content length:', content.length);

// 1. Add CSS for Certificate
const styleMarker = '</style>';
const certificateStyles = `
    /* Luxury Certificate Styles */
    .certificate-gold-border {
      border: 9px double #C59B27;
      box-shadow: 0 0 0 3px rgba(197, 155, 39, 0.4), inset 0 0 0 2px rgba(197, 155, 39, 0.35);
    }
  </style>`;
if (!content.includes('certificate-gold-border')) {
  content = content.replace(styleMarker, certificateStyles);
  console.log('1. Added certificate CSS styles');
}

// 2. Add Tab 3 (Annual KPI) in desktop tabs
const tabAnalysisBtnMarker = `        <!-- Tab 2: SOP Analysis -->
        <button id="tabBtnAnalysis" onclick="switchTab('analysis')" class="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          <i data-lucide="bar-chart-2" class="w-4 h-4"></i>
          <span>វិភាគ SOP</span>
        </button>`;

const annualTabBtn = `        <!-- Tab 2: SOP Analysis -->
        <button id="tabBtnAnalysis" onclick="switchTab('analysis')" class="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 shrink-0 cursor-pointer">
          <i data-lucide="bar-chart-2" class="w-4 h-4"></i>
          <span>វិភាគ SOP</span>
        </button>

        <!-- Tab 3: Annual KPI & Certificates (August to August) -->
        <button id="tabBtnAnnual" onclick="switchTab('annual')" class="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 shrink-0 cursor-pointer">
          <i data-lucide="award" class="w-4 h-4 text-amber-500"></i>
          <span>🏆 KPI ប្រចាំឆ្នាំ & វិញ្ញាបនបត្រ</span>
          <span class="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">ខែ៨-ខែ៨</span>
        </button>`;

if (!content.includes('id="tabBtnAnnual"')) {
  content = content.replace(tabAnalysisBtnMarker, annualTabBtn);
  console.log('2. Added tabBtnAnnual to desktop tabs');
}

// 3. Add mobTabAnnual in mobile bottom bar
const mobAnalysisMarker = `    <button id="mobTabAnalysis" onclick="switchTab('analysis')" class="flex flex-col items-center py-1 px-3 text-slate-400 hover:text-slate-600 transition active:scale-90">
      <i data-lucide="bar-chart-2" class="w-5 h-5"></i>
      <span class="text-[10px] font-semibold mt-0.5">វិភាគ SOP</span>
    </button>`;

const mobAnnualBtn = `    <button id="mobTabAnalysis" onclick="switchTab('analysis')" class="flex flex-col items-center py-1 px-3 text-slate-400 hover:text-slate-600 transition active:scale-90">
      <i data-lucide="bar-chart-2" class="w-5 h-5"></i>
      <span class="text-[10px] font-semibold mt-0.5">វិភាគ SOP</span>
    </button>
    <button id="mobTabAnnual" onclick="switchTab('annual')" class="flex flex-col items-center py-1 px-3 text-slate-400 hover:text-slate-600 transition active:scale-90">
      <i data-lucide="award" class="w-5 h-5 text-amber-500"></i>
      <span class="text-[10px] font-semibold mt-0.5">KPI ឆ្នាំ</span>
    </button>`;

if (!content.includes('id="mobTabAnnual"')) {
  content = content.replace(mobAnalysisMarker, mobAnnualBtn);
  console.log('3. Added mobTabAnnual to mobile bottom bar');
}

// 4. Add staffStartDate to #staffModal
const staffSubjectMarker = `        <!-- Subject / Skill -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ជំនាញ / កម្រិតបង្រៀន <span class="text-rose-500">*</span></label>
          <input type="text" id="staffSubject" required placeholder="ឧ. គណិតវិទ្យា (ថ្នាក់ទី១០-១២) ឬ ភាសាអង់គ្លេស" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition">
        </div>`;

const staffStartDateHtml = `        <!-- Subject / Skill -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ជំនាញ / កម្រិតបង្រៀន <span class="text-rose-500">*</span></label>
          <input type="text" id="staffSubject" required placeholder="ឧ. គណិតវិទ្យា (ថ្នាក់ទី១០-១២) ឬ ភាសាអង់គ្លេស" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition">
        </div>

        <!-- Start Date / Seniority -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ថ្ងៃចូលបម្រើការងារ (Start Date) <span class="text-rose-500">*</span></label>
          <input type="date" id="staffStartDate" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition font-medium text-slate-800">
          <p class="text-[11px] text-slate-500 mt-1">⏱️ ប្រព័ន្ធគណនាអតីតភាពការងារ (Seniority) និងផ្ទៀងផ្ទាត់សិទ្ធិគិត KPI ប្រចាំឆ្នាំ (≥ ៧ខែ) ដោយស្វ័យប្រវត្តិ</p>
        </div>`;

if (!content.includes('id="staffStartDate"')) {
  content = content.replace(staffSubjectMarker, staffStartDateHtml);
  console.log('4. Added staffStartDate input in staffModal');
}

// 5. Add #tabAnnualKpi Section
const sectionAdminMarker = `    <!-- ==================== TAB 3: ADMIN ACCOUNTS (SUPER ADMIN ONLY) ==================== -->
    <section id="tabAdminManagement"`;

const annualKpiSectionHtml = `    <!-- ==================== TAB: ANNUAL KPI (AUG - AUG) & CERTIFICATES ==================== -->
    <section id="tabAnnualKpi" class="hidden space-y-5">
      
      <!-- Annual Header & Cycle Control -->
      <div class="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center space-x-2.5">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center font-bold shadow-xs">
              <i data-lucide="award" class="w-5 h-5"></i>
            </div>
            <div>
              <h2 class="font-display font-black text-xl text-slate-900">វាយតម្លៃ KPI ប្រចាំឆ្នាំ & វិញ្ញាបនបត្របុគ្គលិកឆ្នើម</h2>
              <p class="text-xs text-slate-500 font-medium">វដ្តគិតគូរចាប់ពី <strong class="text-blue-900">ខែសីហា ដល់ ខែសីហា (១ ឆ្នាំពេញ)</strong> • សម្រាប់បុគ្គលិកមានអតីតភាពការងារ <strong class="text-emerald-700">ចាប់ពី ៧ ខែឡើងទៅ</strong></p>
            </div>
          </div>
        </div>

        <div class="flex items-center flex-wrap gap-2.5">
          <!-- Annual Cycle Selector -->
          <div class="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 shadow-2xs">
            <i data-lucide="calendar-range" class="w-4 h-4 text-amber-600"></i>
            <span class="text-xs font-bold text-slate-700">វដ្តប្រចាំឆ្នាំ៖</span>
            <select id="annualCycleSelect" onchange="renderAnnualKpiView()" class="bg-transparent text-xs sm:text-sm font-bold text-blue-950 focus:outline-none cursor-pointer py-1">
              <option value="2025-2026" selected>សីហា ២០២៥ ➔ សីហា ២០២៦ (១ ឆ្នាំ)</option>
              <option value="2024-2025">សីហា ២០២៤ ➔ សីហា ២០២៥ (១ ឆ្នាំ)</option>
              <option value="2026-2027">សីហា ២០២៦ ➔ សីហា ២០២៧ (១ ឆ្នាំ)</option>
            </select>
          </div>

          <!-- Branch Filter for Annual Tab -->
          <div id="annualBranchFilterWrapper" class="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 shadow-2xs">
            <i data-lucide="building-2" class="w-4 h-4 text-indigo-600"></i>
            <span class="text-xs font-bold text-slate-700">សាខា៖</span>
            <select id="annualBranchFilter" onchange="renderAnnualKpiView()" class="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer py-1">
              <!-- Dynamically populated in JS -->
            </select>
          </div>
        </div>
      </div>

      <!-- Annual Policy Card -->
      <div class="bg-gradient-to-r from-amber-50/90 via-blue-50/60 to-indigo-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-xs">
            <i data-lucide="info" class="w-4 h-4"></i>
          </div>
          <div class="space-y-1">
            <h4 class="font-bold text-slate-900 text-sm">គោលការណ៍វាយតម្លៃ និងផ្តល់រង្វាន់លើកទឹកចិត្តប្រចាំឆ្នាំ (V2 Education Policy)៖</h4>
            <div class="text-slate-600 flex flex-wrap gap-x-6 gap-y-1 pt-0.5">
              <span>⏱️ <strong class="text-emerald-700">លក្ខខណ្ឌ Seniority៖</strong> បុគ្គលិកបម្រើការងារ <strong class="text-slate-900">ចាប់ពី ៧ ខែឡើងទៅ ($\ge$ ៧ខែ)</strong> ទើបមានសិទ្ធិគិតពិន្ទុ KPI ប្រចាំឆ្នាំ។</span>
              <span>🎖️ <strong class="text-amber-800">វិញ្ញាបនបត្រកិត្តិយស៖</strong> បុគ្គលិកដែលទទួលបាន <strong class="text-amber-900">និទ្ទេស A (ឆ្នើម)</strong> និង <strong class="text-blue-900">និទ្ទេស B (ល្អប្រសើរ)</strong> ត្រូវបានផ្ដល់ជូនវិញ្ញាបនបត្រផ្លូវការ។</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Annual Metric KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <!-- Metric 1: Total Staff -->
        <div class="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">បុគ្គលិកសរុបក្នុងបញ្ជី</p>
            <div class="flex items-baseline space-x-1.5">
              <h3 id="annualTotalStaffCount" class="text-2xl sm:text-3xl font-black text-slate-900 font-display">០</h3>
              <span class="text-xs text-slate-500 font-bold">នាក់</span>
            </div>
            <p class="text-[11px] text-slate-400">គ្រប់សាខាក្នុងដែនកំណត់</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <i data-lucide="users" class="w-5 h-5"></i>
          </div>
        </div>

        <!-- Metric 2: Eligible Staff (>= 7 months) -->
        <div class="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-bold text-emerald-700 uppercase tracking-wider">គ្រប់លក្ខខណ្ឌ ( $\ge$ ៧ខែ)</p>
            <div class="flex items-baseline space-x-1.5">
              <h3 id="annualEligibleStaffCount" class="text-2xl sm:text-3xl font-black text-emerald-700 font-display">០</h3>
              <span class="text-xs text-slate-500 font-bold">នាក់</span>
            </div>
            <p id="annualIneligibleSubtext" class="text-[11px] text-amber-700 font-medium">ក្រោម ៧ខែ៖ ០ នាក់</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <i data-lucide="check-circle-2" class="w-5 h-5"></i>
          </div>
        </div>

        <!-- Metric 3: Grade A (Outstanding) -->
        <div class="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-bold text-amber-800 uppercase tracking-wider">បុគ្គលិកឆ្នើម (និទ្ទេស A)</p>
            <div class="flex items-baseline space-x-1.5">
              <h3 id="annualGradeACount" class="text-2xl sm:text-3xl font-black text-amber-700 font-display">០</h3>
              <span class="text-xs text-slate-500 font-bold">នាក់</span>
            </div>
            <p class="text-[11px] text-amber-700 font-medium">🎖️ ទទួលបានវិញ្ញាបនបត្រ A</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <i data-lucide="medal" class="w-5 h-5"></i>
          </div>
        </div>

        <!-- Metric 4: Grade B (Excellent) -->
        <div class="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-bold text-blue-800 uppercase tracking-wider">បុគ្គលិកល្អប្រសើរ (និទ្ទេស B)</p>
            <div class="flex items-baseline space-x-1.5">
              <h3 id="annualGradeBCount" class="text-2xl sm:text-3xl font-black text-blue-700 font-display">០</h3>
              <span class="text-xs text-slate-500 font-bold">នាក់</span>
            </div>
            <p class="text-[11px] text-blue-700 font-medium">🎖️ ទទួលបានវិញ្ញាបនបត្រ B</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
            <i data-lucide="award" class="w-5 h-5"></i>
          </div>
        </div>
      </div>

      <!-- Mobile Inset Cards for Annual KPI -->
      <div id="annualKpiCardsContainer" class="block lg:hidden space-y-3">
        <!-- Rendered in JS -->
      </div>

      <!-- Desktop Annual Performance Table -->
      <div class="hidden lg:block bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/90 text-slate-700 text-xs font-semibold border-b border-slate-200 tracking-wider">
                <th class="py-3.5 px-4 text-center w-12">ល.រ</th>
                <th class="py-3.5 px-4">ឈ្មោះ និងតួនាទីបុគ្គលិក</th>
                <th class="py-3.5 px-4">សាខា</th>
                <th class="py-3.5 px-4">ថ្ងៃចូលធ្វើការ & អតីតភាព</th>
                <th class="py-3.5 px-4 text-center">លក្ខខណ្ឌ KPI ឆ្នាំ</th>
                <th class="py-3.5 px-4 text-center">ខែបានវាយតម្លៃ</th>
                <th class="py-3.5 px-4 text-center">ពិន្ទុមធ្យមប្រចាំឆ្នាំ</th>
                <th class="py-3.5 px-4 text-center">និទ្ទេសរួម</th>
                <th class="py-3.5 px-4 text-center">វិញ្ញាបនបត្រកិត្តិយស</th>
              </tr>
            </thead>
            <tbody id="annualKpiTableBody" class="divide-y divide-slate-100 text-sm">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>

    </section>

    <!-- ==================== TAB 3: ADMIN ACCOUNTS (SUPER ADMIN ONLY) ==================== -->
    <section id="tabAdminManagement"`;

if (!content.includes('id="tabAnnualKpi"')) {
  content = content.replace(sectionAdminMarker, annualKpiSectionHtml);
  console.log('5. Added tabAnnualKpi Section in HTML');
}

// 6. Add #certificateModal
const adminUserModalMarker = `  <!-- 4. ADMIN USER MODAL (ADD / EDIT) -->`;
const certModalHtml = `  <!-- 3.5 OFFICIAL LUXURY CERTIFICATE MODAL (GRADE A & B) -->
  <div id="certificateModal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md hidden flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
    <div class="max-w-5xl w-full my-auto transition-all transform flex flex-col items-center">
      
      <!-- Top Action Toolbar (Floating) -->
      <div class="no-print w-full flex items-center justify-between bg-slate-900/95 text-white px-4 py-3 rounded-2xl mb-3 shadow-2xl border border-white/10 backdrop-blur-md">
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span class="font-bold text-xs sm:text-sm text-amber-300 flex items-center gap-1.5">
            <i data-lucide="award" class="w-4 h-4 text-amber-400"></i>
            វិញ្ញាបនបត្រកិត្តិយសផ្លូវការ (Official Certificate of Recognition)
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button id="btnDownloadCertImage" onclick="downloadCertificateImage()" class="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer">
            <i data-lucide="camera" class="w-4 h-4"></i>
            <span>ទាញយករូបភាព HD (PNG)</span>
          </button>
          
          <button onclick="printCertificatePDF()" class="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs sm:text-sm font-bold border border-white/20 transition active:scale-95 cursor-pointer">
            <i data-lucide="printer" class="w-4 h-4 text-blue-300"></i>
            <span>បោះពុម្ព / PDF</span>
          </button>

          <button onclick="closeCertificateModal()" class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Printable Certificate Canvas -->
      <div id="printableCertificateWrapper" class="w-full flex justify-center overflow-x-auto pb-4">
        <div id="certificateCanvasPaper" class="bg-[#FCFBF7] text-slate-900 w-[1000px] min-h-[690px] p-8 sm:p-10 relative shadow-2xl rounded-2xl certificate-gold-border select-none flex flex-col justify-between overflow-hidden">
          
          <!-- Inner Gold Thin Border Frame -->
          <div class="absolute inset-3 border-2 border-[#D4AF37]/60 pointer-events-none rounded-lg"></div>
          <div class="absolute inset-5 border border-[#AA771C]/30 pointer-events-none"></div>

          <!-- Luxury Ornate Corner Accents -->
          <div class="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-[#C59B27] pointer-events-none"></div>
          <div class="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-[#C59B27] pointer-events-none"></div>
          <div class="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-[#C59B27] pointer-events-none"></div>
          <div class="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-[#C59B27] pointer-events-none"></div>

          <!-- Subtle Background Watermark Logo -->
          <div class="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
            <img src="v2b.png" alt="Watermark" class="w-[500px] h-[500px] object-contain">
          </div>

          <!-- Certificate Header -->
          <div class="relative z-10 text-center space-y-2 pt-2">
            <div class="flex items-center justify-center space-x-3 mb-1">
              <div class="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-amber-300/80 flex items-center justify-center">
                <img src="v2b.png" alt="V2 Education Logo" class="w-full h-full object-contain">
              </div>
            </div>
            
            <div class="text-[12px] font-bold tracking-widest text-[#855B14] uppercase">KINGDOM OF CAMBODIA • ព្រះរាជាណាចក្រកម្ពុជា</div>
            <h4 class="font-serif font-black text-xl text-blue-950 tracking-wider">V2 EDUCATION ACADEMY • វិទ្យាស្ថានអប់រំ វីធូ</h4>
            
            <div class="pt-3">
              <div class="inline-block relative">
                <div id="certTitleBadgeContainer" class="px-8 py-2.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-white shadow-lg border border-amber-300">
                  <h1 id="certMainTitle" class="font-display font-black text-2xl tracking-wide uppercase drop-shadow-sm">
                    វិញ្ញាបនបត្របុគ្គលិកឆ្នើម
                  </h1>
                  <p id="certSubTitle" class="text-[11px] font-bold text-amber-100 tracking-widest uppercase">
                    CERTIFICATE OF EXCELLENCE
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Certificate Body Content -->
          <div class="relative z-10 text-center space-y-4 py-4 px-6 max-w-3xl mx-auto">
            <p class="text-sm text-slate-600 font-medium">វិញ្ញាបនបត្រនេះត្រូវបានប្រគល់ជូនជាកិត្តិយស និងការលើកទឹកចិត្តដល់៖</p>
            
            <!-- Recipient Name -->
            <div class="space-y-1">
              <h2 id="certRecipientName" class="text-3xl sm:text-4xl font-black text-blue-950 tracking-wide font-serif pb-1 border-b-2 border-amber-400/80 inline-block px-8">
                ឈ្មោះបុគ្គលិក
              </h2>
            </div>

            <!-- Position, Branch & Seniority -->
            <div class="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 pt-1">
              <span class="bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg text-amber-950 flex items-center gap-1.5">
                <i data-lucide="briefcase" class="w-4 h-4 text-amber-700"></i>
                <span id="certRecipientRole">តួនាទី៖ ...</span>
              </span>
              <span class="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg text-indigo-950 flex items-center gap-1.5">
                <i data-lucide="building-2" class="w-4 h-4 text-indigo-700"></i>
                <span id="certRecipientBranch">សាខា៖ ...</span>
              </span>
              <span class="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-emerald-950 flex items-center gap-1.5">
                <i data-lucide="clock" class="w-4 h-4 text-emerald-700"></i>
                <span id="certRecipientSeniority">អតីតភាពការងារ៖ ...</span>
              </span>
            </div>

            <!-- Citation Paragraph -->
            <p id="certCitationText" class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pt-2">
              ដើម្បីជាសក្ខីភាពបញ្ជាក់ថា សាមីខ្លួនបានខិតខំបំពេញការងារយ៉ាងសកម្ម ប្រកបដោយវិជ្ជាជីវៈ ការទទួលខុសត្រូវ និងទទួលបានលទ្ធផលវាយតម្លៃ KPI ប្រចាំឆ្នាំ៖ <strong id="certScoreDisplay" class="text-blue-900 font-black text-base">៩៣.៥/១០០</strong> <span id="certGradeBadgeInline" class="px-2 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">និទ្ទេស A (ឆ្នើម)</span> សម្រាប់ការវាយតម្លៃការងារតាមស្តង់ដារ SOP វដ្តប្រចាំឆ្នាំ <strong id="certCyclePeriod">សីហា ២០២៥ ដល់ សីហា ២០២៦</strong>។
            </p>
          </div>

          <!-- Certificate Footer: Signatures & Golden Ribbon Seal -->
          <div class="relative z-10 pt-4 pb-2 px-6">
            <div class="grid grid-cols-3 items-end text-center">
              
              <!-- Left: Branch Director Signature -->
              <div class="space-y-1 text-xs">
                <p id="certIssueDateText" class="text-slate-500 font-medium">រាជធានីភ្នំពេញ ថ្ងៃទី... ខែ... ឆ្នាំ...</p>
                <p class="font-bold text-slate-800">ប្រធានសាខា</p>
                <div class="h-14 flex items-center justify-center">
                  <span class="text-slate-300 italic text-[11px]">(ហត្ថលេខា & ឈ្មោះ)</span>
                </div>
                <p id="certBranchDirectorName" class="font-bold text-blue-950 border-t border-slate-300 pt-1 w-44 mx-auto">Admin សាខា</p>
              </div>

              <!-- Center: Official Royal Ribbon Medal Seal -->
              <div class="flex flex-col items-center justify-center">
                <div class="relative w-24 h-24 flex items-center justify-center">
                  <div id="certMedalOuter" class="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-xl flex items-center justify-center border-2 border-amber-600">
                    <div class="w-full h-full rounded-full bg-gradient-to-b from-amber-700 to-amber-950 flex flex-col items-center justify-center text-white text-center p-1 border border-amber-300/60 shadow-inner">
                      <div class="text-[9px] font-black tracking-widest text-amber-300">V2-KPI</div>
                      <div id="certMedalGradeLetter" class="text-xl font-black font-serif text-amber-200 leading-none my-0.5">A</div>
                      <div class="flex text-amber-300 text-[8px]">★★★★★</div>
                      <div id="certMedalGradeText" class="text-[7px] font-bold text-amber-100 uppercase tracking-tighter">OUTSTANDING</div>
                    </div>
                  </div>
                </div>
                <span class="text-[10px] font-bold text-amber-800 mt-1 uppercase tracking-wider">OFFICIAL RECOGNITION</span>
              </div>

              <!-- Right: General Director / Super Admin Signature -->
              <div class="space-y-1 text-xs">
                <p class="text-slate-500 font-medium">បានឃើញ និងឯកភាព</p>
                <p class="font-bold text-slate-800">អគ្គនាយកវិទ្យាស្ថានអប់រំ វីធូ</p>
                <div class="h-14 flex items-center justify-center">
                  <div class="w-16 h-16 rounded-full border-2 border-dashed border-rose-400/60 flex items-center justify-center text-rose-500 text-[9px] font-bold rotate-[-12deg] bg-rose-50/50">
                    ត្រាសាលា
                  </div>
                </div>
                <p id="certGeneralDirectorName" class="font-bold text-blue-950 border-t border-slate-300 pt-1 w-44 mx-auto">អភិបាលប្រព័ន្ធ (Admin ធំ)</p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  </div>

  <!-- 4. ADMIN USER MODAL (ADD / EDIT) -->`;

if (!content.includes('id="certificateModal"')) {
  content = content.replace(adminUserModalMarker, certModalHtml);
  console.log('6. Added certificateModal in HTML');
}

fs.writeFileSync(targetFile, content);
console.log('Saved HTML markup changes successfully!');
