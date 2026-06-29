document.addEventListener('DOMContentLoaded', () => {
    // STATE VARIABLES
    let currentStep = 1;
    const totalSteps = 3;
    const formData = {
        age: '',
        environment: [],
        symptoms: [],
        trustFactor: ''
    };

    // DOM ELEMENTS
    const startSurveyBtn = document.getElementById('start-survey-btn');
    const heroSection = document.getElementById('hero-section');
    const questionnaireSection = document.getElementById('questionnaire-section');
    const calculationSection = document.getElementById('calculation-section');
    const resultsSection = document.getElementById('results-section');
    
    const surveyForm = document.getElementById('survey-form');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressFill = document.getElementById('survey-progress-fill');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    
    // NAVIGATION FLOW: START SURVEY
    if (startSurveyBtn) {
        startSurveyBtn.addEventListener('click', () => {
            heroSection.classList.add('hidden');
            questionnaireSection.classList.remove('hidden');
            // Scroll to top of card
            questionnaireSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // MULTI-STEP NAVIGATION ACTIONS
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                saveStepData();
                if (currentStep < totalSteps) {
                    goToStep(currentStep + 1);
                }
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    }

    // FORM SUBMISSION TRIGGER
    if (surveyForm) {
        surveyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateCurrentStep()) {
                saveStepData();
                startCalculationSequence();
            }
        });
    }

    // STEP TRANSITION LOGIC
    function goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.survey-step').forEach(el => el.classList.remove('active'));
        // Show current step
        document.getElementById(`step-${step}`).classList.add('active');
        
        currentStep = step;
        
        // Update Buttons Visibility
        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        } else if (currentStep === totalSteps) {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
        
        // Update Progress Bar
        const progressPercentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update Step Indicators
        stepIndicators.forEach(ind => {
            const indStep = parseInt(ind.getAttribute('data-step'));
            ind.classList.remove('active', 'completed');
            if (indStep === currentStep) {
                ind.classList.add('active');
            } else if (indStep < currentStep) {
                ind.classList.add('completed');
            }
        });
    }

    // STEP VALIDATION
    function validateCurrentStep() {
        if (currentStep === 1) {
            const ageSelected = document.querySelector('input[name="age"]:checked');
            if (!ageSelected) {
                alert('請選擇您的年齡層！');
                return false;
            }
            const envSelected = document.querySelectorAll('input[name="environment"]:checked');
            if (envSelected.length === 0) {
                alert('請至少勾選一項生活環境或工作型態！');
                return false;
            }
        } else if (currentStep === 2) {
            const symptomSelected = document.querySelectorAll('input[name="symptoms"]:checked');
            if (symptomSelected.length === 0) {
                alert('請至少選擇一項過去 28 天內的肌膚症狀！');
                return false;
            }
        } else if (currentStep === 3) {
            const trustSelected = document.querySelector('input[name="trust_factor"]:checked');
            if (!trustSelected) {
                alert('請選擇最能決定您購買機能液意志的關鍵因素！');
                return false;
            }
        }
        return true;
    }

    // SAVE FORM DATA TEMPORARILY
    function saveStepData() {
        if (currentStep === 1) {
            formData.age = document.querySelector('input[name="age"]:checked').value;
            formData.environment = Array.from(document.querySelectorAll('input[name="environment"]:checked')).map(el => el.value);
        } else if (currentStep === 2) {
            formData.symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(el => el.value);
        } else if (currentStep === 3) {
            formData.trustFactor = document.querySelector('input[name="trust_factor"]:checked').value;
        }
    }

    // CLINICAL CALCULATION ANIMATION SEQUENCE
    function startCalculationSequence() {
        questionnaireSection.classList.add('hidden');
        calculationSection.classList.remove('hidden');
        calculationSection.scrollIntoView({ behavior: 'smooth' });

        const consoleLogs = document.getElementById('console-logs');
        const calcTitle = document.getElementById('calc-status-title');
        const spinnerFill = document.getElementById('calc-spinner-fill');
        
        consoleLogs.innerHTML = '';
        
        // Log entries to output sequentially
        const logSteps = [
            { text: '正在初始化 LRP-Microbiome 檢測模組...', type: 'info', title: '讀取肌膚參數...' },
            { text: '讀取生活特徵環境因子: 空氣污染、高溫乾燥參數...', type: 'info', title: '環境參數載入中...' },
            { text: '量化肌膚底層泛紅程度及術後微創修護瓶頸...', type: 'info', title: '屏障功能分析...' },
            { text: '計算角質層經皮水分流失率 (TEWL) 與微生態失衡分數...', type: 'info', title: '指標運算中...' },
            { text: '篩選醫學臨床驗證成分 (B5 積雪草苷, 微生態益生精粹)...', type: 'info', title: '處方配方重組...' },
            { text: '醫師處方與 O2O 數位兌換簡訊金鑰已封裝。', type: 'success', title: '分析完成！' }
        ];

        let index = 0;
        const totalDuration = 3000; // Total 3 seconds
        const stepInterval = totalDuration / logSteps.length;

        // Animate circular spinner
        // Stroke dasharray is 283 (circumference)
        spinnerFill.style.transition = `stroke-dashoffset ${totalDuration}ms linear`;
        spinnerFill.style.strokeDashoffset = '0';

        const intervalId = setInterval(() => {
            if (index < logSteps.length) {
                const item = logSteps[index];
                calcTitle.textContent = item.title;
                
                const li = document.createElement('li');
                li.textContent = item.text;
                if (item.type === 'success') {
                    li.classList.add('success');
                }
                consoleLogs.appendChild(li);
                
                // Auto scroll console box to bottom
                consoleLogs.parentElement.scrollTop = consoleLogs.parentElement.scrollHeight;
                
                index++;
            } else {
                clearInterval(intervalId);
                setTimeout(() => {
                    showPrescriptionResults();
                }, 400);
            }
        }, stepInterval);
    }

    // RENDER RESULTS SECTION
    function showPrescriptionResults() {
        calculationSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        // Calculate Scores
        const scores = calculateSkinMetrics();
        const overallScore = Math.round((scores.elasticity + scores.tolerance + scores.radiance + scores.barrier + scores.smoothness) / 5);

        // Render Score UI
        document.getElementById('skin-score-value').textContent = overallScore;
        const levelBadge = document.getElementById('score-level-badge');
        
        if (overallScore >= 80) {
            levelBadge.textContent = '輕微受損 / 穩定維穩';
            levelBadge.style.backgroundColor = '#10B981';
        } else if (overallScore >= 60) {
            levelBadge.textContent = '中度屏障受損 / 敏感修護';
            levelBadge.style.backgroundColor = '#F59E0B';
        } else {
            levelBadge.textContent = '極度屏障受損 / 醫師協同修護';
            levelBadge.style.backgroundColor = '#EF4444';
        }

        // Render Custom SVG Radar Chart
        renderRadarChart(scores);

        // Render Metrics Progress Bars (Animate with latency)
        setTimeout(() => {
            animateProgressBar('elasticity', scores.elasticity);
            animateProgressBar('tolerance', scores.tolerance);
            animateProgressBar('radiance', scores.radiance);
            animateProgressBar('barrier', scores.barrier);
            animateProgressBar('smoothness', scores.smoothness);
        }, 300);

        // Render Diagnostic & Customized Product Recommendations
        generateClinicalDiagnosis(scores);
    }

    // SCORING ALGORITHM
    function calculateSkinMetrics() {
        let elasticity = 85;
        let tolerance = 90;
        let radiance = 85;
        let barrier = 90;
        let smoothness = 90;

        // 1. Age Factor on Elasticity
        if (formData.age === '25-30') {
            elasticity -= 5;
        } else if (formData.age === '31-40') {
            elasticity -= 12;
            radiance -= 5;
        } else if (formData.age === '41+') {
            elasticity -= 20;
            radiance -= 10;
        }

        // 2. Life Environment Impact
        if (formData.environment.includes('pollution')) {
            radiance -= 10;
            barrier -= 10;
            smoothness -= 5;
        }
        if (formData.environment.includes('aircon')) {
            tolerance -= 10;
            barrier -= 15;
        }
        if (formData.environment.includes('aesthetic')) {
            barrier -= 10;
            tolerance -= 5;
        }
        if (formData.environment.includes('stress')) {
            elasticity -= 10;
            radiance -= 15;
        }

        // 3. Symptoms Impact (Pain Points)
        if (formData.symptoms.includes('redness')) {
            tolerance -= 25;
            barrier -= 10;
        }
        if (formData.symptoms.includes('dryness')) {
            elasticity -= 15;
            barrier -= 20;
            smoothness -= 15;
        }
        if (formData.symptoms.includes('acne')) {
            smoothness -= 25;
            radiance -= 10;
        }
        if (formData.symptoms.includes('post_op')) {
            barrier -= 25;
            tolerance -= 20;
        }

        // Clip scores between 20 and 100 for visual chart harmony
        return {
            elasticity: Math.max(20, Math.min(100, elasticity)),
            tolerance: Math.max(20, Math.min(100, tolerance)),
            radiance: Math.max(20, Math.min(100, radiance)),
            barrier: Math.max(20, Math.min(100, barrier)),
            smoothness: Math.max(20, Math.min(100, smoothness))
        };
    }

    function animateProgressBar(id, value) {
        const fill = document.getElementById(`bar-fill-${id}`);
        const valText = document.getElementById(`bar-val-${id}`);
        if (fill && valText) {
            fill.style.width = `${value}%`;
            valText.textContent = `${value}%`;
        }
    }

    // DRAW DYNAMIC SVG RADAR CHART
    function renderRadarChart(scores) {
        const svg = document.getElementById('radar-chart');
        const gridsContainer = document.getElementById('radar-grids');
        const labelsContainer = document.getElementById('radar-labels');
        const polygon = document.getElementById('radar-polygon');
        const pointsContainer = document.getElementById('radar-points');

        // Clear dynamically drawn elements
        gridsContainer.innerHTML = '';
        labelsContainer.innerHTML = '';
        pointsContainer.innerHTML = '';

        const cx = 200;
        const cy = 200;
        const r = 130; // Max radius
        const dimensions = [
            { name: '彈性 (Elasticity)', key: 'elasticity' },
            { name: '耐受力 (Tolerance)', key: 'tolerance' },
            { name: '光澤度 (Radiance)', key: 'radiance' },
            { name: '屏障功能 (Barrier)', key: 'barrier' },
            { name: '平滑度 (Smoothness)', key: 'smoothness' }
        ];
        const numAxes = dimensions.length;

        // Helper: Convert Polar to Cartesian coordinates
        // Rotated by -90 degrees (so first axis is straight UP)
        function getCoords(index, val) {
            const angle = (index * 2 * Math.PI / numAxes) - (Math.PI / 2);
            const dist = (val / 100) * r;
            const x = cx + dist * Math.cos(angle);
            const y = cy + dist * Math.sin(angle);
            return { x, y };
        }

        // 1. Draw Grid Web Lines (Concentric pentagons representing 20%, 40%, 60%, 80%, 100%)
        const gridLevels = [20, 40, 60, 80, 100];
        gridLevels.forEach(level => {
            const pointsArr = [];
            for (let i = 0; i < numAxes; i++) {
                const pt = getCoords(i, level);
                pointsArr.push(`${pt.x},${pt.y}`);
            }
            const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            poly.setAttribute('points', pointsArr.join(' '));
            poly.setAttribute('class', 'radar-grid-poly');
            poly.setAttribute('fill', 'none');
            gridsContainer.appendChild(poly);
        });

        // 2. Draw 5 Radial Axes Lines & Label Text
        dimensions.forEach((dim, idx) => {
            // Draw axis line from center to 100% outer point
            const outerPt = getCoords(idx, 100);
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', cx);
            line.setAttribute('y1', cy);
            line.setAttribute('x2', outerPt.x);
            line.setAttribute('y2', outerPt.y);
            line.setAttribute('class', 'radar-axis-line');
            gridsContainer.appendChild(line);

            // Draw axis label text outside the outer circle
            const labelPt = getCoords(idx, 118);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', labelPt.x);
            text.setAttribute('y', labelPt.y);
            text.setAttribute('class', 'radar-label-text');
            text.setAttribute('text-anchor', 'middle');
            
            // Minor vertical alignment adjustment based on angle position
            const angle = (idx * 2 * Math.PI / numAxes) - (Math.PI / 2);
            if (Math.abs(Math.cos(angle)) < 0.1) {
                // Top or bottom alignment adjustment
                if (Math.sin(angle) < 0) {
                    text.setAttribute('y', labelPt.y - 2); // Top label
                } else {
                    text.setAttribute('y', labelPt.y + 10); // Bottom label
                }
            } else {
                text.setAttribute('y', labelPt.y + 4);
                if (Math.cos(angle) < 0) {
                    text.setAttribute('text-anchor', 'end'); // Left side
                } else {
                    text.setAttribute('text-anchor', 'start'); // Right side
                }
            }
            text.textContent = dim.name.split(' ')[0];
            labelsContainer.appendChild(text);
        });

        // 3. Render and Animate the Active Score Polygon
        const activePoints = [];
        dimensions.forEach((dim, idx) => {
            const val = scores[dim.key];
            const pt = getCoords(idx, val);
            activePoints.push({ x: pt.x, y: pt.y, val: val });
        });

        // Build path coordinates string
        const pointsStr = activePoints.map(p => `${p.x},${p.y}`).join(' ');
        
        // Dynamic animation transition (scale poly outline)
        polygon.setAttribute('points', pointsStr);

        // 4. Place individual data dots on corners
        activePoints.forEach((pt, idx) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pt.x);
            circle.setAttribute('cy', pt.y);
            circle.setAttribute('r', '4');
            circle.setAttribute('class', 'radar-point');
            circle.setAttribute('title', `${dimensions[idx].name}: ${pt.val}%`);
            pointsContainer.appendChild(circle);
        });
    }

    // DIAGNOSIS TEXT AND PRODUCT RECOMMENDATION MATRIX
    function generateClinicalDiagnosis(scores) {
        const diagReport = document.getElementById('diagnostic-report-text');
        const prodListContainer = document.getElementById('product-recommendation-list');
        prodListContainer.innerHTML = '';

        let reportText = '';
        let recommendCodes = []; // Array of recommended product keys

        // Determine profile based on environment and symptoms
        const ageTag = formData.age === '25-30' || formData.age === '31-40' ? '『理性修護需求核心圈』' : '『基礎醫學養護圈』';
        
        reportText += `診斷報告：您屬於理膚寶水研究案中定義之 ${ageTag}。您的肌膚亟需從基礎保濕升級為『醫美級機能液』修護，重組肌膚微生物平衡並提升屏障厚度，從根本降低因誤用產品導致的隱形成本與時間成本。<br><br>`;

        // Trace physical signs
        if (formData.symptoms.includes('post_op') || formData.symptoms.includes('redness')) {
            reportText += `分析顯示您的<strong>肌膚耐受力與物理性防禦力顯著受損 (耐受值僅 ${scores.tolerance}%)</strong>。此情況常見於醫美術後表皮微創，或因環境劇烈溫差造成的微血管過度擴張。此時應首重抗炎、舒緩泛紅並加速新生，推薦使用高濃度維生素原 B5 與積雪草苷成分進行肌膚緊急灌救。`;
            recommendCodes.push('b5_baume', 'b5_serum');
        } else if (formData.symptoms.includes('dryness')) {
            reportText += `分析顯示您的<strong>肌膚水脂屏障呈空洞化狀態 (屏障分值 ${scores.barrier}%)</strong>。皮脂腺分泌不足且角質黏合力下降，導致水份流失加快、乾裂起屑。建議使用三重修護配方，結合神經醯胺與微生態益生精粹，長效鎖水並重塑屏障皮脂網。`;
            recommendCodes.push('b5_baume', 'toleriane_fluid');
        } else if (formData.symptoms.includes('acne')) {
            reportText += `分析顯示您的<strong>肌膚平滑度表現不佳 (平滑值 ${scores.smoothness}%)</strong>。主要是因皮脂腺分泌不均，導致舊廢角質堆積與痤瘡桿菌滋生。推薦採用溫和的水楊酸配合 LHA (辛醯水楊酸) 以及多重益生元複合配方，在深層溫和煥膚的同時控制皮脂流動，降低痘痘反覆機率。`;
            recommendCodes.push('effaclar_duo', 'b5_serum');
        } else {
            // General clinical maintenance
            reportText += `分析顯示您的<strong>肌膚狀況目前維持在中等健康範疇 (屏障分值 ${scores.barrier}%)</strong>。但因生活環境中處於強烈空調冷氣房或長熬夜壓力，微生態平衡隱藏失序風險。建議使用高耐受度修護水乳，鞏固表皮防護鏈，防範外界隱性刺激。`;
            recommendCodes.push('toleriane_fluid', 'b5_serum');
        }

        // Format unique voucher details
        const randId = `LRP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        document.getElementById('prescription-id').textContent = randId;

        diagReport.innerHTML = reportText;

        // Render Product items
        const allProducts = {
            'b5_baume': {
                name: 'B5+全面修復霜 (B5萬用霜)',
                badge: '極致急救修護 / 明星萬用霜',
                desc: '富含高濃度 5% 維生素原B5、積雪草苷與全新微生態科技，臨床實證能 1 小時極速舒緩泛紅乾燥、改善微創疤痕。',
                use: '早晚或隨時厚擦局部紅腫及受損表皮'
            },
            'b5_serum': {
                name: 'B5瞬效全面修復精華',
                badge: '醫學修護強效液',
                desc: '富含 10% 高濃度維生素原B5，結合強效玻尿酸與防禦複合物，質地如隱形繃帶般輕盈滲透，阻斷外界刺激。',
                use: '每日化妝水後，精華液步驟使用'
            },
            'effaclar_duo': {
                name: '淨痘無瑕極效精華 DUO+M',
                badge: '抗痘防瑕控油水楊酸精華',
                desc: '全新 Phylobioma 抗痘專利配方，協同水楊酸、煙醯胺，精準改善粉刺及反覆痘痘，淡化深色紅褐色痘疤。',
                use: '局部或全臉薄擦以抑制出油痘痘'
            },
            'toleriane_fluid': {
                name: '多容安舒緩濕潤乳液 (安心乳)',
                badge: '極度敏感肌維穩專用',
                desc: '無香精、酒精、防腐劑添加。富含專利神經醯胺與理膚寶水溫泉水，極簡修護配方，提供肌膚 48 小時深度鎖水。',
                use: '爽膚水後均勻擦拭於面部與頸部'
            }
        };

        // Render recommended items
        recommendCodes.forEach(code => {
            const prod = allProducts[code];
            if (prod) {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="product-badge-line">${prod.badge}</div>
                    <h6>${prod.name}</h6>
                    <p class="product-desc">${prod.desc}</p>
                    <div class="product-use"><i class="fa-solid fa-clock"></i> ${prod.use}</div>
                `;
                prodListContainer.appendChild(card);
            }
        });
    }

    // O2O CTA BOOKING FORM CONTROLLER
    const o2oForm = document.getElementById('o2o-booking-form');
    const bookingSuccessBox = document.getElementById('booking-success-box');
    const bookBtn = document.getElementById('book-btn');

    if (o2oForm) {
        o2oForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('user-name').value.trim();
            const phoneInput = document.getElementById('user-phone').value.trim();

            if (!nameInput) {
                alert('請輸入受訪者姓名！');
                return;
            }
            
            const phoneRegex = /^09\d{8}$/;
            if (!phoneRegex.test(phoneInput)) {
                alert('請輸入正確的台灣手機號碼 (例如: 0912345678)！');
                return;
            }

            // Simulating API loading State
            bookBtn.disabled = true;
            bookBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 正在傳送預約資料...';

            setTimeout(() => {
                // Generate a pseudo voucher code
                const voucherCode = `LRP-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
                document.getElementById('voucher-code').textContent = voucherCode;

                // Hide Form and Show success state
                o2oForm.classList.add('hidden');
                bookingSuccessBox.classList.remove('hidden');
                
                // Track success conversion in console mockup
                console.log(`[O2O SUCCESS] Client ${nameInput} (${phoneInput}) booked. Voucher: ${voucherCode}`);
            }, 1000);
        });
    }

    // PRINT PRESCRIPTION BUTTON CONTROLLER
    const printBtn = document.getElementById('print-prescription-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
