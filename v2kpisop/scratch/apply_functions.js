const fs = require('fs');

const targetFile = 'c:\\Users\\user\\OneDrive\\V2 Education TK\\v2kpisop\\index.html';
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Update renderAll
const oldRenderAll = `    function renderAll() {
      try { applySystemSettingsToUI(); } catch (e) { console.warn('renderAll settings:', e); }
      try { renderMetrics(); } catch (e) { console.warn('renderAll metrics:', e); }
      try { renderStaffTable(); } catch (e) { console.warn('renderAll staff table:', e); }
      try { renderAnalysisView(); } catch (e) { console.warn('renderAll analysis:', e); }
      try { if (activeTab === 'admins') renderAdminUsersTable(); } catch (e) { console.warn('renderAll admins:', e); }
      try { if (activeTab === 'settings') populateSettingsForm(); } catch (e) { console.warn('renderAll settings:', e); }
      try { if (window.lucide && lucide.createIcons) lucide.createIcons(); } catch (e) { console.warn('renderAll icons:', e); }
    }`;

const newRenderAll = `    function renderAll() {
      try { applySystemSettingsToUI(); } catch (e) { console.warn('renderAll settings:', e); }
      try { renderMetrics(); } catch (e) { console.warn('renderAll metrics:', e); }
      try { renderStaffTable(); } catch (e) { console.warn('renderAll staff table:', e); }
      try { renderAnalysisView(); } catch (e) { console.warn('renderAll analysis:', e); }
      try { if (activeTab === 'annual') renderAnnualKpiView(); } catch (e) { console.warn('renderAll annual:', e); }
      try { if (activeTab === 'admins') renderAdminUsersTable(); } catch (e) { console.warn('renderAll admins:', e); }
      try { if (activeTab === 'settings') populateSettingsForm(); } catch (e) { console.warn('renderAll settings:', e); }
      try { if (window.lucide && lucide.createIcons) lucide.createIcons(); } catch (e) { console.warn('renderAll icons:', e); }
    }`;

if (content.includes(oldRenderAll)) {
  content = content.replace(oldRenderAll, newRenderAll);
  console.log('1. Updated renderAll with renderAnnualKpiView');
}

// 2. Insert Core Functions before `// Reset Sample Data`
const resetMarker = `    // Reset Sample Data
    function resetToSampleData() {`;

const coreFunctions = `    // --- SENIORITY (អតីតភាពការងារ) & ANNUAL KPI (AUG TO AUG) CORE LOGIC ---
    function calculateSeniority(startDateStr, targetDate = new Date()) {
      if (!startDateStr) {
        return { years: 0, months: 0, days: 0, totalMonths: 0, textKh: 'ពុំទាន់កំណត់', isEligibleKpi: false };
      }
      const start = new Date(startDateStr);
      const end = targetDate instanceof Date ? targetDate : new Date(targetDate);
      if (isNaN(start.getTime())) {
        return { years: 0, months: 0, days: 0, totalMonths: 0, textKh: 'ពុំទាន់កំណត់', isEligibleKpi: false };
      }
      if (end < start) {
        return { years: 0, months: 0, days: 0, totalMonths: 0, textKh: 'ទើបចាប់ផ្តើម', isEligibleKpi: false };
      }

      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();
      let days = end.getDate() - start.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        days += prevMonthLastDay;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const totalMonths = (years * 12) + months + (days >= 15 ? 0.5 : 0);
      const isEligibleKpi = totalMonths >= 7;

      let parts = [];
      if (years > 0) parts.push(\`\${toKhmerNum(years)} ឆ្នាំ\`);
      if (months > 0) parts.push(\`\${toKhmerNum(months)} ខែ\`);
      if (days > 0 && years === 0 && months < 3) parts.push(\`\${toKhmerNum(days)} ថ្ងៃ\`);
      if (parts.length === 0) parts.push('ទើបចូលបម្រើការ');

      return {
        years,
        months,
        days,
        totalMonths,
        textKh: parts.join(' '),
        isEligibleKpi
      };
    }

    function calculateStaffAnnualKpi(staffId, cycleVal = '2025-2026') {
      const staff = staffList.find(s => s.id === staffId);
      if (!staff) return null;

      const [startYearStr, endYearStr] = cycleVal.split('-');
      const startYear = parseInt(startYearStr, 10);
      const endYear = parseInt(endYearStr, 10);

      // Cut-off evaluation at August of endYear
      const cycleCutoffDate = new Date(endYear, 7, 31);
      const sen = calculateSeniority(staff.startDate, cycleCutoffDate);

      // Annual cycle includes: August-December of startYear AND January-August of endYear
      const cycleAssessments = assessments.filter(a => {
        if (a.staffId !== staffId) return false;
        if (a.year === startYear && a.month >= 8 && a.month <= 12) return true;
        if (a.year === endYear && a.month >= 1 && a.month <= 8) return true;
        return false;
      });

      const count = cycleAssessments.length;
      let avgKpi = null;
      let gradeInfo = null;

      if (count > 0) {
        const total = cycleAssessments.reduce((sum, a) => sum + (parseFloat(a.totalKpi) || 0), 0);
        avgKpi = Math.round((total / count) * 10) / 10;
        gradeInfo = getGradeInfo(avgKpi);
      }

      return {
        staff,
        seniority: sen,
        isEligible: sen.isEligibleKpi,
        assessmentsCount: count,
        avgKpi,
        gradeInfo,
        cycleVal,
        startYear,
        endYear,
        cycleLabel: \`សីហា \${toKhmerNum(startYear)} ដល់ សីហា \${toKhmerNum(endYear)}\`
      };
    }

    function renderAnnualKpiView() {
      const cycleSelect = document.getElementById('annualCycleSelect');
      const cycleVal = cycleSelect ? cycleSelect.value : '2025-2026';
      const branchFilter = document.getElementById('annualBranchFilter');
      const branchWrapper = document.getElementById('annualBranchFilterWrapper');
      
      const isSuper = currentUser && currentUser.role === 'SUPER_ADMIN';

      // Branch filter synchronization
      if (branchFilter) {
        if (!isSuper) {
          if (branchWrapper) branchWrapper.classList.add('hidden');
        } else {
          if (branchWrapper) branchWrapper.classList.remove('hidden');
          const currentVal = branchFilter.value || 'ALL';
          const branches = getUniqueBranches();
          branchFilter.innerHTML = \`
            <option value="ALL">គ្រប់សាខាទាំងអស់ (All)</option>
            \${branches.map(b => \`<option value="\${b}" \${b === currentVal ? 'selected' : ''}>\${b}</option>\`).join('')}
          \`;
        }
      }

      let visibleStaff = getScopedStaffList();
      if (isSuper && branchFilter && branchFilter.value !== 'ALL') {
        visibleStaff = visibleStaff.filter(s => (s.branch || 'សាខាទូទៅ') === branchFilter.value);
      }

      // Calculate annual data for each staff
      const annualDataList = visibleStaff.map(s => calculateStaffAnnualKpi(s.id, cycleVal));

      // Metric calculations
      const totalStaff = annualDataList.length;
      const eligibleStaff = annualDataList.filter(d => d.isEligible).length;
      const ineligibleStaff = totalStaff - eligibleStaff;
      const gradeAStaff = annualDataList.filter(d => d.isEligible && d.gradeInfo && d.gradeInfo.grade === 'A').length;
      const gradeBStaff = annualDataList.filter(d => d.isEligible && d.gradeInfo && d.gradeInfo.grade === 'B').length;

      const mTotal = document.getElementById('annualTotalStaffCount');
      const mEligible = document.getElementById('annualEligibleStaffCount');
      const mIneligible = document.getElementById('annualIneligibleSubtext');
      const mGradeA = document.getElementById('annualGradeACount');
      const mGradeB = document.getElementById('annualGradeBCount');

      if (mTotal) mTotal.textContent = toKhmerNum(totalStaff);
      if (mEligible) mEligible.textContent = toKhmerNum(eligibleStaff);
      if (mIneligible) mIneligible.textContent = \`ក្រោម ៧ខែ (បុគ្គលិកថ្មី)៖ \${toKhmerNum(ineligibleStaff)} នាក់\`;
      if (mGradeA) mGradeA.textContent = toKhmerNum(gradeAStaff);
      if (mGradeB) mGradeB.textContent = toKhmerNum(gradeBStaff);

      // Render Desktop Table
      const tbody = document.getElementById('annualKpiTableBody');
      if (tbody) {
        if (annualDataList.length === 0) {
          tbody.innerHTML = \`
            <tr>
              <td colspan="9" class="py-10 text-center text-slate-400 text-xs">
                <i data-lucide="users-2" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
                <div>មិនទាន់មានទិន្នន័យបុគ្គលិកនៅក្នុងដែនកំណត់នេះឡើយ</div>
              </td>
            </tr>
          \`;
        } else {
          tbody.innerHTML = annualDataList.map((item, index) => {
            const { staff, seniority, isEligible, assessmentsCount, avgKpi, gradeInfo } = item;
            const initial = staff.name ? staff.name.trim().charAt(0) : 'ប';

            // Certificate button logic
            let certActionHtml = '';
            if (!isEligible) {
              certActionHtml = \`<span class="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">ក្រោម ៧ខែ (មិនគិត KPI)</span>\`;
            } else if (gradeInfo && gradeInfo.grade === 'A') {
              certActionHtml = \`
                <button onclick="openCertificateModal('\${staff.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer">
                  <i data-lucide="award" class="w-3.5 h-3.5 text-yellow-200"></i>
                  <span>វិញ្ញាបនបត្រ A (ឆ្នើម)</span>
                </button>
              \`;
            } else if (gradeInfo && gradeInfo.grade === 'B') {
              certActionHtml = \`
                <button onclick="openCertificateModal('\${staff.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer">
                  <i data-lucide="award" class="w-3.5 h-3.5 text-blue-200"></i>
                  <span>វិញ្ញាបនបត្រ B (ល្អប្រសើរ)</span>
                </button>
              \`;
            } else if (gradeInfo) {
              certActionHtml = \`<span class="text-xs text-slate-400 font-medium">ពុំទាន់ដល់កម្រិត A/B</span>\`;
            } else {
              certActionHtml = \`<span class="text-xs text-slate-400 italic">មិនទាន់មានទិន្នន័យ</span>\`;
            }

            return \`
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-4 text-center text-xs font-bold text-slate-400">\${toKhmerNum(index + 1)}</td>
                
                <td class="py-3.5 px-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-900 border border-blue-200 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      \${initial}
                    </div>
                    <div>
                      <div class="font-bold text-slate-900 text-sm">\${staff.name}</div>
                      <div class="text-xs text-slate-500 font-medium">\${staff.role}</div>
                    </div>
                  </div>
                </td>

                <td class="py-3.5 px-4">
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80">
                    <i data-lucide="building-2" class="w-3 h-3 text-indigo-600"></i>
                    <span>\${staff.branch || 'សាខាទូទៅ'}</span>
                  </span>
                </td>

                <td class="py-3.5 px-4">
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-slate-800">⏱️ \${seniority.textKh}</div>
                    <div class="text-[11px] text-slate-400">ចូល៖ \${staff.startDate || 'ពុំទាន់កំណត់'}</div>
                  </div>
                </td>

                <td class="py-3.5 px-4 text-center">
                  \${isEligible
                    ? '<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300"><i data-lucide=\"check-circle-2\" class=\"w-3 h-3 text-emerald-600\"></i> មានសិទ្ធិ (≥៧ខែ)</span>'
                    : '<span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300"><i data-lucide=\"clock\" class=\"w-3 h-3 text-amber-600\"></i> ក្រោម ៧ខែ (បុគ្គលិកថ្មី)</span>'
                  }
                </td>

                <td class="py-3.5 px-4 text-center">
                  <span class="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">\${toKhmerNum(assessmentsCount)} / ១២ ខែ</span>
                </td>

                <td class="py-3.5 px-4 text-center">
                  \${avgKpi !== null
                    ? \`<span class="font-display font-black text-sm text-blue-950">\${toKhmerNum(avgKpi)}<span class="text-xs text-slate-400 font-normal">/100</span></span>\`
                    : '<span class="text-xs text-slate-400 italic">គ្មានទិន្នន័យ</span>'
                  }
                </td>

                <td class="py-3.5 px-4 text-center">
                  \${gradeInfo
                    ? \`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs \${gradeInfo.colorClass}">\${gradeInfo.badgeText}</span>\`
                    : '<span class="text-xs text-slate-400">-</span>'
                  }
                </td>

                <td class="py-3.5 px-4 text-center">
                  \${certActionHtml}
                </td>
              </tr>
            \`;
          }).join('');
        }
      }

      // Render Mobile Inset Cards
      const cardsCont = document.getElementById('annualKpiCardsContainer');
      if (cardsCont) {
        if (annualDataList.length === 0) {
          cardsCont.innerHTML = \`<div class="bg-white p-6 rounded-2xl text-center text-slate-400 text-xs">មិនមានទិន្នន័យឡើយ</div>\`;
        } else {
          cardsCont.innerHTML = annualDataList.map((item) => {
            const { staff, seniority, isEligible, assessmentsCount, avgKpi, gradeInfo } = item;
            const initial = staff.name ? staff.name.trim().charAt(0) : 'ប';

            let certBtnMobile = '';
            if (isEligible && gradeInfo && (gradeInfo.grade === 'A' || gradeInfo.grade === 'B')) {
              const isA = gradeInfo.grade === 'A';
              certBtnMobile = \`
                <button onclick="openCertificateModal('\${staff.id}')" class="w-full py-2 px-3 \${isA ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs">
                  <i data-lucide="award" class="w-3.5 h-3.5"></i>
                  <span>ចេញវិញ្ញាបនបត្រ \${isA ? 'A (ឆ្នើម)' : 'B (ល្អប្រសើរ)'}</span>
                </button>
              \`;
            }

            return \`
              <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      \${initial}
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-900 text-sm leading-tight">\${staff.name}</h4>
                      <p class="text-xs text-slate-500">\${staff.role} • \${staff.branch || 'សាខាទូទៅ'}</p>
                    </div>
                  </div>
                  <div>
                    \${gradeInfo ? \`<span class="px-2.5 py-0.5 rounded-full text-xs font-bold border \${gradeInfo.colorClass}">\${gradeInfo.badgeText}</span>\` : '<span class="text-xs text-slate-400">មិនទាន់វាយតម្លៃ</span>'}
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div>
                    <span class="text-slate-400 block text-[10px]">អតីតភាពការងារ</span>
                    <strong class="text-slate-800">\${seniority.textKh}</strong>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px]">លក្ខខណ្ឌ KPI ឆ្នាំ</span>
                    <strong class="\${isEligible ? 'text-emerald-700' : 'text-amber-800'}">\${isEligible ? '✅ គ្រប់ ៧ខែឡើង' : '⏳ ក្រោម ៧ខែ'}</strong>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px]">ខែបានវាយតម្លៃ</span>
                    <strong class="text-slate-800">\${toKhmerNum(assessmentsCount)}/១២ ខែ</strong>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px]">ពិន្ទុមធ្យមប្រចាំឆ្នាំ</span>
                    <strong class="text-blue-900">\${avgKpi !== null ? toKhmerNum(avgKpi) + '/100' : '-'}</strong>
                  </div>
                </div>

                \${certBtnMobile}
              </div>
            \`;
          }).join('');
        }
      }

      try { if (window.lucide && lucide.createIcons) lucide.createIcons(); } catch (e) {}
    }

    // --- CERTIFICATE MODAL LOGIC & EXPORT ---
    let currentCertStaffId = null;

    function openCertificateModal(staffId) {
      const cycleSelect = document.getElementById('annualCycleSelect');
      const cycleVal = cycleSelect ? cycleSelect.value : '2025-2026';
      const annualData = calculateStaffAnnualKpi(staffId, cycleVal);

      if (!annualData || !annualData.staff) {
        alert('រកមិនឃើញទិន្នន័យបុគ្គលិកឡើយ!');
        return;
      }

      currentCertStaffId = staffId;
      const { staff, seniority, avgKpi, gradeInfo, startYear, endYear } = annualData;
      const grade = gradeInfo ? gradeInfo.grade : 'A';
      const isGradeA = grade === 'A';

      // Elements
      const modal = document.getElementById('certificateModal');
      const mainTitle = document.getElementById('certMainTitle');
      const subTitle = document.getElementById('certSubTitle');
      const badgeBox = document.getElementById('certTitleBadgeContainer');
      const nameEl = document.getElementById('certRecipientName');
      const roleEl = document.getElementById('certRecipientRole');
      const branchEl = document.getElementById('certRecipientBranch');
      const seniorityEl = document.getElementById('certRecipientSeniority');
      const scoreEl = document.getElementById('certScoreDisplay');
      const gradeBadgeInline = document.getElementById('certGradeBadgeInline');
      const cyclePeriodEl = document.getElementById('certCyclePeriod');
      const medalOuter = document.getElementById('certMedalOuter');
      const medalLetter = document.getElementById('certMedalGradeLetter');
      const medalText = document.getElementById('certMedalGradeText');
      const dateText = document.getElementById('certIssueDateText');
      const branchDirectorName = document.getElementById('certBranchDirectorName');
      const generalDirectorName = document.getElementById('certGeneralDirectorName');

      // Populate Name, Role, Branch & Seniority
      if (nameEl) nameEl.textContent = staff.name;
      if (roleEl) roleEl.textContent = \`តួនាទី៖ \${staff.role}\`;
      if (branchEl) branchEl.textContent = \`សាខា៖ \${staff.branch || 'សាខាទូទៅ'}\`;
      if (seniorityEl) seniorityEl.textContent = \`អតីតភាពការងារ៖ \${seniority.textKh}\`;
      if (scoreEl) scoreEl.textContent = \`\${toKhmerNum(avgKpi || 90)}/១០០\`;
      if (cyclePeriodEl) cyclePeriodEl.textContent = \`សីហា \${toKhmerNum(startYear)} ដល់ សីហា \${toKhmerNum(endYear)}\`;

      // Set Date in Khmer
      const now = new Date();
      const curDay = toKhmerNum(now.getDate());
      const curMonthName = KHMER_MONTHS[now.getMonth()].name;
      const curYearKh = toKhmerNum(now.getFullYear());
      if (dateText) dateText.textContent = \`រាជធានីភ្នំពេញ, ថ្ងៃទី\${curDay} ខែ\${curMonthName} ឆ្នាំ\${curYearKh}\`;

      // Branch Director & Super Admin Name
      const branchAdmin = adminUsers.find(u => u.branch === staff.branch);
      if (branchDirectorName) branchDirectorName.textContent = branchAdmin ? branchAdmin.name : 'ប្រធានសាខា';
      const superAdminUser = adminUsers.find(u => u.role === 'SUPER_ADMIN');
      if (generalDirectorName) generalDirectorName.textContent = superAdminUser ? superAdminUser.name : 'អភិបាលប្រព័ន្ធ (Admin ធំ)';

      // Theme according to Grade A vs Grade B
      if (isGradeA) {
        if (mainTitle) mainTitle.textContent = 'វិញ្ញាបនបត្របុគ្គលិកឆ្នើម';
        if (subTitle) subTitle.textContent = 'CERTIFICATE OF EXCELLENCE';
        if (badgeBox) badgeBox.className = 'px-8 py-2.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-white shadow-lg border border-amber-300';
        if (gradeBadgeInline) {
          gradeBadgeInline.className = 'px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300';
          gradeBadgeInline.textContent = 'និទ្ទេស A (ឆ្នើម • OUTSTANDING)';
        }
        if (medalOuter) medalOuter.className = 'w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-xl flex items-center justify-center border-2 border-amber-600';
        if (medalLetter) medalLetter.textContent = 'A';
        if (medalText) medalText.textContent = 'OUTSTANDING';
      } else {
        if (mainTitle) mainTitle.textContent = 'វិញ្ញាបនបត្របុគ្គលិកល្អប្រសើរ';
        if (subTitle) subTitle.textContent = 'CERTIFICATE OF MERIT & ACHIEVEMENT';
        if (badgeBox) badgeBox.className = 'px-8 py-2.5 rounded-full bg-gradient-to-r from-blue-900 via-indigo-600 to-blue-900 text-white shadow-lg border border-indigo-300';
        if (gradeBadgeInline) {
          gradeBadgeInline.className = 'px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300';
          gradeBadgeInline.textContent = 'និទ្ទេស B (ល្អប្រសើរ • EXCELLENT)';
        }
        if (medalOuter) medalOuter.className = 'w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-400 to-cyan-300 p-1 shadow-xl flex items-center justify-center border-2 border-indigo-600';
        if (medalLetter) medalLetter.textContent = 'B';
        if (medalText) medalText.textContent = 'EXCELLENT';
      }

      modal.classList.remove('hidden');
      try { if (window.lucide && lucide.createIcons) lucide.createIcons(); } catch (e) {}
    }

    function closeCertificateModal() {
      const modal = document.getElementById('certificateModal');
      if (modal) modal.classList.add('hidden');
      currentCertStaffId = null;
    }

    async function downloadCertificateImage() {
      const paper = document.getElementById('certificateCanvasPaper');
      const btn = document.getElementById('btnDownloadCertImage');
      if (!paper || typeof html2canvas === 'undefined') {
        alert('បណ្ណាល័យបង្កើតរូបភាពមិនទាន់រួចរាល់ សូមព្យាយាមម្តងទៀត!');
        return;
      }

      const originalHtml = btn.innerHTML;
      btn.innerHTML = \`<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>កំពុងទាញយករូប...</span>\`;
      btn.disabled = true;

      try {
        const staff = staffList.find(s => s.id === currentCertStaffId);
        const staffName = staff ? staff.name.replace(/[\\/\\\\?%*:|"<> ]/g, '_') : 'Staff';

        const canvas = await html2canvas(paper, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#FCFBF7'
        });

        const imageUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = \`វិញ្ញាបនបត្រ_\${staffName}_V2_KPI.png\`;
        link.href = imageUri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('📸 បានទាញយកវិញ្ញាបនបត្រកម្រិត HD ជោគជ័យ!', 'success');
      } catch (err) {
        console.error('Certificate image download error:', err);
        alert('មានបញ្ហាក្នុងការទាញយករូបភាព សូមប្រើប្រាស់មុខងារ «បោះពុម្ព / PDF» ជំនួសវិញ');
      } finally {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        try { if (window.lucide && lucide.createIcons) lucide.createIcons(); } catch (e) {}
      }
    }

    function printCertificatePDF() {
      const paper = document.getElementById('certificateCanvasPaper');
      if (!paper) return;

      const printWindow = window.open('', '_blank', 'width=1150,height=800');
      if (!printWindow) {
        alert('សូមអនុញ្ញាតបើក Pop-up Window ក្នុង Browser ដើម្បីបោះពុម្ព!');
        return;
      }

      printWindow.document.write(\`
        <!DOCTYPE html>
        <html lang="km">
        <head>
          <meta charset="UTF-8">
          <title>វិញ្ញាបនបត្រកិត្តិយស - V2 Education</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              font-family: 'Kantumruy Pro', sans-serif;
              background-color: #ffffff;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: A4 landscape;
              margin: 0.8cm;
            }
            .certificate-gold-border {
              border: 9px double #C59B27 !important;
              box-shadow: 0 0 0 3px rgba(197, 155, 39, 0.4), inset 0 0 0 2px rgba(197, 155, 39, 0.35) !important;
            }
          </style>
        </head>
        <body>
          \${paper.outerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
        </html>
      \`);
      printWindow.document.close();
    }

    // Reset Sample Data
    function resetToSampleData() {`;

if (content.includes(resetMarker)) {
  content = content.replace(resetMarker, coreFunctions);
  console.log('2. Injected core functions before resetToSampleData');
} else {
  console.log('resetMarker not found!');
}

fs.writeFileSync(targetFile, content);
console.log('Saved index.html successfully!');
