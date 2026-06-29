document.addEventListener('DOMContentLoaded', () => {
    // Navigation elements
    const heroSection = document.getElementById('hero-section');
    const surveySection = document.getElementById('survey-section');
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');
    const successSection = document.getElementById('success-section');

    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const o2oForm = document.getElementById('o2o-form');
    const printBtn = document.getElementById('print-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Step elements
    const stepTitle = document.getElementById('step-title');
    const stepCount = document.getElementById('step-count');
    const progressBar = document.getElementById('survey-progress');
    const step1Content = document.getElementById('step-1-content');
    const step2Content = document.getElementById('step-2-content');
    const step3Content = document.getElementById('step-3-content');

    // Loading texts
    const loadingSubtext = document.getElementById('loading-subtext');
    const loadingPhases = [
        "正在初始化臨床診斷模型...",
        "正在評估經皮水分流失量 (TEWL)...",
        "正在分析表皮屏障脂質排列結構...",
        "正在比對微生態益生菌落多樣性...",
        "臨床診斷已完成，正在配對修護處方..."
    ];

    // State Variables
    let currentStep = 1;
    const totalSteps = 3;
    const stepData = {
        age: '',
        lifestyle: [],
        symptoms: [],
        factor: ''
    };

    // --- Helper: Option Card Style Updates ---
    function updateOptionCardStates() {
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            const input = card.querySelector('input');
            if (input.checked) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    // Attach event listeners to all option inputs
    document.querySelectorAll('.option-card input').forEach(input => {
        input.addEventListener('change', () => {
            // For radio buttons, we need to refresh all sibling cards because checking one unchecks another
            if (input.type === 'radio') {
                const name = input.name;
                document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                    const card = radio.closest('.option-card');
                    if (radio.checked) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            } else {
                // Checkbox toggle
                const card = input.closest('.option-card');
                if (input.checked) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            }
        });
    });

    // --- Action: Start Survey ---
    startBtn.addEventListener('click', () => {
        heroSection.style.display = 'none';
        surveySection.style.display = 'block';
        currentStep = 1;
        updateStepUI();
    });

    // --- Action: Prev Button ---
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepUI();
        }
    });

    // --- Action: Next Button ---
    nextBtn.addEventListener('click', () => {
        if (validateCurrentStep()) {
            saveStepData();
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepUI();
            } else {
                // Last step submitted -> start calculation animation
                runClinicalDiagnostic();
            }
        } else {
            alert('請先完成當前步驟的必填欄位！');
        }
    });

    // --- Step UI Updater ---
    function updateStepUI() {
        // Toggle contents
        step1Content.style.display = currentStep === 1 ? 'block' : 'none';
        step2Content.style.display = currentStep === 2 ? 'block' : 'none';
        step3Content.style.display = currentStep === 3 ? 'block' : 'none';

        // Update titles
        if (currentStep === 1) {
            stepTitle.textContent = "基本人口特徵與生活環境";
            prevBtn.style.visibility = 'hidden';
            nextBtn.querySelector('span').textContent = "下一步";
        } else if (currentStep === 2) {
            stepTitle.textContent = "生理痛點與泛紅常態";
            prevBtn.style.visibility = 'visible';
            nextBtn.querySelector('span').textContent = "下一步";
        } else if (currentStep === 3) {
            stepTitle.textContent = "消費心理與權威信任度";
            prevBtn.style.visibility = 'visible';
            nextBtn.querySelector('span').textContent = "提交診斷";
        }

        // Step text & progress bar
        stepCount.textContent = `步驟 ${currentStep} / ${totalSteps}`;
        const progressPercent = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Refresh checked visual states
        updateOptionCardStates();
        
        // Scroll to top of card smoothly
        surveySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- Step Validation ---
    function validateCurrentStep() {
        if (currentStep === 1) {
            // Must select age radio
            const ageSelected = document.querySelector('input[name="age"]:checked');
            return ageSelected !== null;
        }
        if (currentStep === 2) {
            // Symptoms are checkboxes (optional or multiple choice, but since it's a survey, we let it proceed even if 0 are selected)
            return true;
        }
        if (currentStep === 3) {
            // Must select buying factor radio
            const factorSelected = document.querySelector('input[name="factors"]:checked');
            return factorSelected !== null;
        }
        return false;
    }

    // --- Save Step Data to State ---
    function saveStepData() {
        if (currentStep === 1) {
            stepData.age = document.querySelector('input[name="age"]:checked').value;
            stepData.lifestyle = Array.from(document.querySelectorAll('input[name="lifestyle"]:checked')).map(el => el.value);
        } else if (currentStep === 2) {
            stepData.symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(el => el.value);
        } else if (currentStep === 3) {
            stepData.factor = document.querySelector('input[name="factors"]:checked').value;
        }
    }

    // --- Clinical Calculation & Diagnosis Logic ---
    function runClinicalDiagnostic() {
        surveySection.style.display = 'none';
        loadingSection.style.display = 'block';
        
        // Cycle loading messages to look scientific
        let messageIndex = 0;
        loadingSubtext.textContent = loadingPhases[messageIndex];
        
        const intervalId = setInterval(() => {
            messageIndex++;
            if (messageIndex < loadingPhases.length) {
                loadingSubtext.textContent = loadingPhases[messageIndex];
            }
        }, 500);

        // Transition from loading to results after 2.5 seconds
        setTimeout(() => {
            clearInterval(intervalId);
            loadingSection.style.display = 'none';
            resultSection.style.display = 'block';
            
            // Calculate and display scores
            const scores = calculateSkinMetrics();
            animateMetrics(scores);
        }, 2500);
    }

    function calculateSkinMetrics() {
        // Default base scores
        let elasticity = 80;
        let tolerance = 75; // Anti-sensitivity / Tolerance
        let radiance = 78;
        let barrier = 80;
        let smoothness = 82;

        // 1. Age Impact
        if (stepData.age === '20-24') {
            elasticity += 5;
            radiance += 4;
            smoothness += 3;
        } else if (stepData.age === '31-40') {
            elasticity -= 6;
            radiance -= 4;
            barrier -= 3;
        } else if (stepData.age === '41+') {
            elasticity -= 15;
            radiance -= 10;
            smoothness -= 8;
            barrier -= 5;
        }

        // 2. Lifestyle Stresses (Checkboxes)
        stepData.lifestyle.forEach(stress => {
            if (stress === 'pollution') {
                radiance -= 12;
                tolerance -= 10;
            } else if (stress === 'ac') {
                barrier -= 10;
                elasticity -= 8;
            } else if (stress === 'clinic') {
                barrier -= 15;
                tolerance -= 15;
            } else if (stress === 'stress') {
                radiance -= 10;
                smoothness -= 10;
                tolerance -= 5;
            }
        });

        // 3. Physical Symptoms (Checkboxes)
        stepData.symptoms.forEach(symp => {
            if (symp === 'redness') {
                tolerance -= 22;
                barrier -= 12;
            } else if (symp === 'dryness') {
                elasticity -= 15;
                smoothness -= 12;
                barrier -= 10;
            } else if (symp === 'acne') {
                smoothness -= 20;
                radiance -= 10;
            } else if (symp === 'post_treatment') {
                barrier -= 25;
                tolerance -= 20;
                elasticity -= 5;
            }
        });

        // Ensure scores stay inside reasonable clinical limits (10% - 98%)
        const clamp = (val) => Math.min(98, Math.max(10, val));

        return {
            elasticity: clamp(elasticity),
            tolerance: clamp(tolerance),
            radiance: clamp(radiance),
            barrier: clamp(barrier),
            smoothness: clamp(smoothness)
        };
    }

    function animateMetrics(scores) {
        // Update metric values and trigger width animations
        const metrics = [
            { key: 'elasticity', val: scores.elasticity },
            { key: 'sensitivity', val: scores.tolerance },
            { key: 'radiance', val: scores.radiance },
            { key: 'barrier', val: scores.barrier },
            { key: 'smoothness', val: scores.smoothness }
        ];

        metrics.forEach(m => {
            const valLabel = document.getElementById(`val-${m.key}`);
            const fillBar = document.getElementById(`fill-${m.key}`);
            
            // Set value label
            valLabel.textContent = `${m.val}%`;
            
            // Reset to 0% first for clean transition effect
            fillBar.style.width = '0%';
            
            // Trigger transition layout
            setTimeout(() => {
                fillBar.style.width = `${m.val}%`;
                
                // Color formatting based on severity
                if (m.val < 45) {
                    fillBar.style.background = 'linear-gradient(90deg, #EF4444, #F59E0B)'; // Warning red/orange
                    valLabel.style.color = '#EF4444';
                } else if (m.val < 70) {
                    fillBar.style.background = 'linear-gradient(90deg, #0096D6, #00D696)'; // Classic brand blue
                    valLabel.style.color = '#0096D6';
                } else {
                    fillBar.style.background = 'linear-gradient(90deg, #10B981, #34D399)'; // Healthy Green
                    valLabel.style.color = '#10B981';
                }
            }, 100);
        });

        // Dynamic Diagnostic Text adjustments
        const summaryText = document.getElementById('diagnostic-summary');
        let severeSymptom = false;
        
        if (scores.barrier < 50 || scores.tolerance < 45) {
            severeSymptom = true;
        }

        if (severeSymptom) {
            summaryText.innerHTML = `<strong>臨床檢測警訊：</strong>您的屏障防護力 (${scores.barrier}%) 與肌膚耐受度 (${scores.tolerance}%) 已低於健康基準值，符合企劃案定義之<strong>『理性修護需求核心圈』</strong>。
            強烈建議立刻停止使用含酒精、高濃度酸類及過多香精的開架平替保養，全面升級使用醫美級『B5全面修護』系列。
            藉由微生態益生菌萃取與高濃度維生素原B5，進行深層角質層修復，以在28天內重建厚實屏障，降低隱性護理的時間與金錢成本。`;
        } else {
            summaryText.innerHTML = `<strong>檢測報告：</strong>您的肌膚屏障健康處於亞健康狀態。雖然沒有立即性的嚴重受損，但面對外界污染與溫差，仍時常出現屏障防禦缺陷。
            為避免演變成敏感性肌膚，推薦升級為醫美級『屏障管理』機能液修護，補充益生精粹，從底層重組肌膚微生物菌群，達到長期防禦保濕效果。`;
        }

        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // --- Action: O2O Form Submission ---
    o2oForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const phone = document.getElementById('phone').value;
        
        // Hide result view and show success coupon
        resultSection.style.display = 'none';
        successSection.style.display = 'block';

        // Mask phone digits for safety: 0912***456
        const maskedPhone = phone.substring(0, 4) + '***' + phone.substring(7);
        
        // Fill ticket info
        document.getElementById('ticket-name').textContent = username;
        document.getElementById('ticket-phone').textContent = maskedPhone;
        
        // Generate random ticket code
        const randomCode = 'RX-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('ticket-id').textContent = randomCode;

        successSection.scrollIntoView({ behavior: 'smooth' });
    });

    // --- Action: Print / PDF Save simulated ---
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // --- Action: Restart Survey ---
    restartBtn.addEventListener('click', () => {
        // Reset state variables
        currentStep = 1;
        stepData.age = '';
        stepData.lifestyle = [];
        stepData.symptoms = [];
        stepData.factor = '';

        // Reset Form inputs
        document.getElementById('survey-form').reset();
        document.getElementById('o2o-form').reset();
        
        // Remove active styling on option cards
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('active');
        });

        // Toggle visibility
        successSection.style.display = 'none';
        heroSection.style.display = 'block';

        heroSection.scrollIntoView({ behavior: 'smooth' });
    });
});
