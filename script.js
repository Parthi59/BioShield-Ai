document.addEventListener('DOMContentLoaded', function() {
    console.log('BioShield AI loaded successfully!');
    
    // Initialize authentication system
    initializeAuth();
    initializeDashboard();
    
    // Authentication System
    function initializeAuth() {
        const loginBtn = document.getElementById('loginBtn');
        const authModal = document.getElementById('authModal');
        const modalClose = document.getElementById('modalClose');
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToLogin = document.getElementById('switchToLogin');
        
        // Check if user is already logged in
        checkAuthStatus();
        
        // Event listeners
        loginBtn.addEventListener('click', () => showAuthModal('login'));
        modalClose.addEventListener('click', hideAuthModal);
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) hideAuthModal();
        });
        
        loginTab.addEventListener('click', () => switchAuthTab('login'));
        signupTab.addEventListener('click', () => switchAuthTab('signup'));
        switchToSignup.addEventListener('click', () => switchAuthTab('signup'));
        switchToLogin.addEventListener('click', () => switchAuthTab('login'));
        
        // Form submissions
        loginForm.addEventListener('submit', handleLogin);
        signupForm.addEventListener('submit', handleSignup);
        
        // Logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
    
    function showAuthModal(type = 'login') {
        const authModal = document.getElementById('authModal');
        authModal.style.display = 'flex';
        switchAuthTab(type);
        document.body.style.overflow = 'hidden';
    }
    
    function hideAuthModal() {
        const authModal = document.getElementById('authModal');
        authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function switchAuthTab(type) {
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const modalTitle = document.getElementById('modalTitle');
        
        if (type === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            modalTitle.textContent = 'Welcome Back';
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
            modalTitle.textContent = 'Create Account';
        }
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simulate authentication
        if (email && password) {
            const userData = {
                id: generateId(),
                name: email.split('@')[0],
                email: email,
                loginTime: new Date().toISOString(),
                allergens: [],
                scans: [],
                preferences: {
                    emailNotifications: true,
                    pushNotifications: true,
                    autoScan: true,
                    detailedResults: false,
                    saveHistory: true,
                    shareData: false
                }
            };
            
            localStorage.setItem('bioshield_user', JSON.stringify(userData));
            showSuccessMessage('Login successful!');
            hideAuthModal();
            updateAuthUI(userData);
        } else {
            showErrorMessage('Please fill in all fields');
        }
    }
    
    function handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!name || !email || !password || !confirmPassword) {
            showErrorMessage('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showErrorMessage('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showErrorMessage('Password must be at least 6 characters');
            return;
        }
        
        // Simulate user creation
        const userData = {
            id: generateId(),
            name: name,
            email: email,
            joinDate: new Date().toISOString(),
            allergens: [],
            scans: [],
            preferences: {
                emailNotifications: true,
                pushNotifications: true,
                autoScan: true,
                detailedResults: false,
                saveHistory: true,
                shareData: false
            }
        };
        
        localStorage.setItem('bioshield_user', JSON.stringify(userData));
        showSuccessMessage('Account created successfully!');
        hideAuthModal();
        updateAuthUI(userData);
    }
    
    function handleLogout() {
        localStorage.removeItem('bioshield_user');
        updateAuthUI(null);
        showMainContent();
        showSuccessMessage('Logged out successfully');
    }
    
    function checkAuthStatus() {
        const userData = JSON.parse(localStorage.getItem('bioshield_user'));
        if (userData) {
            updateAuthUI(userData);
        }
    }
    
    function updateAuthUI(userData) {
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const dashboardLink = document.getElementById('dashboardLink');
        
        if (userData) {
            // User is logged in
            loginBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            userName.textContent = userData.name;
            dashboardLink.style.display = 'block';
            
            // Update dashboard data
            updateDashboardData(userData);
        } else {
            // User is logged out
            loginBtn.style.display = 'block';
            userMenu.style.display = 'none';
            dashboardLink.style.display = 'none';
        }
    }
    
    // Dashboard System
    function initializeDashboard() {
        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavigation);
        });
        
        // Sidebar navigation
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', handleSidebarNavigation);
        });
        
        // Allergen profile
        const saveAllergensBtn = document.getElementById('saveAllergens');
        if (saveAllergensBtn) {
            saveAllergensBtn.addEventListener('click', saveAllergenProfile);
        }
        
        // Preferences
        const preferenceInputs = document.querySelectorAll('#preferences input');
        preferenceInputs.forEach(input => {
            input.addEventListener('change', savePreferences);
        });
    }
    
    function handleNavigation(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href').substring(1);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        if (target === 'home') {
            showMainContent();
        } else if (target === 'dashboard') {
            showDashboard();
        }
    }
    
    function handleSidebarNavigation(e) {
        e.preventDefault();
        const section = e.target.getAttribute('data-section');
        
        // Update active sidebar link
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show corresponding section
        document.querySelectorAll('.dashboard-section').forEach(section => section.classList.remove('active'));
        document.getElementById(section).classList.add('active');
    }
    
    function showMainContent() {
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('dashboardContent').style.display = 'none';
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('[href="#home"]').classList.add('active');
    }
    
    function showDashboard(section = 'overview') {
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('[href="#dashboard"]').classList.add('active');
        
        // Show specific section
        document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Update sidebar active link
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
    }
    
    function updateDashboardData(userData) {
        // Update user name in dashboard
        const dashboardUserName = document.getElementById('dashboardUserName');
        if (dashboardUserName) {
            dashboardUserName.textContent = userData.name;
        }
        
        // Update stats
        const scans = userData.scans || [];
        document.getElementById('totalScans').textContent = scans.length;
        document.getElementById('alertsFound').textContent = scans.filter(scan => scan.healthScore < 4).length;
        document.getElementById('safeScans').textContent = scans.filter(scan => scan.healthScore >= 7).length;
        document.getElementById('streakDays').textContent = calculateStreak(scans);
        
        // Update preferences
        if (userData.preferences) {
            Object.keys(userData.preferences).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.checked = userData.preferences[key];
                }
            });
        }
        
        // Update allergen profile
        if (userData.allergens) {
            userData.allergens.forEach(allergen => {
                const checkbox = document.querySelector(`[data-allergen="${allergen}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        // Update scan history
        updateScanHistory(scans);
        updateActivityList(scans);
    }
    
    function saveAllergenProfile() {
        const userData = JSON.parse(localStorage.getItem('bioshield_user'));
        if (!userData) return;
        
        const selectedAllergens = [];
        document.querySelectorAll('[data-allergen]').forEach(checkbox => {
            if (checkbox.checked) {
                selectedAllergens.push(checkbox.getAttribute('data-allergen'));
            }
        });
        
        userData.allergens = selectedAllergens;
        localStorage.setItem('bioshield_user', JSON.stringify(userData));
        
        showSuccessMessage('Allergen profile saved successfully!');
    }
    
    function savePreferences() {
        const userData = JSON.parse(localStorage.getItem('bioshield_user'));
        if (!userData) return;
        
        const preferences = {};
        document.querySelectorAll('#preferences input').forEach(input => {
            preferences[input.id] = input.checked;
        });
        
        userData.preferences = { ...userData.preferences, ...preferences };
        localStorage.setItem('bioshield_user', JSON.stringify(userData));
        
        showSuccessMessage('Preferences saved!');
    }
    
    function updateScanHistory(scans) {
        const scanHistoryList = document.getElementById('scanHistoryList');
        if (!scanHistoryList) return;
        
        if (scans.length === 0) {
            scanHistoryList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📱</div>
                    <h3>No scans yet</h3>
                    <p>Start scanning foods to build your history</p>
                    <button class="btn-primary" onclick="showMainContent()">Start Scanning</button>
                </div>
            `;
        } else {
            scanHistoryList.innerHTML = scans.map(scan => `
                <div class="scan-item">
                    <div class="scan-icon">${scan.healthScore < 4 ? '🔴' : scan.healthScore >= 7 ? '🟢' : '🟡'}</div>
                    <div class="scan-details">
                        <h4>${scan.productName || scan.foodName}</h4>
                        <p>Health Score: ${scan.healthScore}/10</p>
                        <span class="scan-time">${new Date(scan.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div class="scan-status ${scan.healthScore < 4 ? 'warning' : scan.healthScore >= 7 ? 'safe' : 'medium'}">
                        ${scan.healthScore < 4 ? 'Poor' : scan.healthScore >= 7 ? 'Healthy' : 'Average'}
                    </div>
                </div>
            `).join('');
        }
    }
    
    function updateActivityList(scans) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        const recentScans = scans.slice(-5).reverse();
        
        if (recentScans.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">🔍</div>
                    <div class="activity-content">
                        <p>Welcome to BioShield AI! Start scanning to see your activity here.</p>
                        <span class="activity-time">Just now</span>
                    </div>
                </div>
            `;
        } else {
            activityList.innerHTML = recentScans.map(scan => `
                <div class="activity-item">
                    <div class="activity-icon">${scan.healthScore < 4 ? '🔴' : scan.healthScore >= 7 ? '🟢' : '🟡'}</div>
                    <div class="activity-content">
                        <p>Analyzed ${scan.productName || scan.foodName} - Score: ${scan.healthScore}/10</p>
                        <span class="activity-time">${timeAgo(scan.timestamp)}</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Enhanced scanning functionality
    function enhancedScanningSetup() {
        const liveScanBtn = document.querySelector('.btn-primary');
        const uploadArea = document.querySelector('.upload-area');
        
        if (liveScanBtn) {
            liveScanBtn.addEventListener('click', function() {
                const userData = JSON.parse(localStorage.getItem('bioshield_user'));
                
                // Simulate scanning animation
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="btn-icon">⏳</span> Scanning...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    
                    // Generate ingredient analysis
                    const analysisResult = generateIngredientAnalysis();

                    const scanResult = {
                        id: generateId(),
                        productName: 'Quick Scan Product',
                        healthScore: analysisResult.healthScore,
                        timestamp: new Date().toISOString(),
                        pros: analysisResult.pros,
                        cons: analysisResult.cons,
                        redFlags: analysisResult.redFlags,
                        greenFlags: analysisResult.greenFlags,
                        alternatives: analysisResult.alternatives,
                        cookingTips: analysisResult.cookingTips,
                        riskLevel: analysisResult.riskLevel
                    };

                    // Save scan to user data
                    if (userData) {
                        userData.scans = userData.scans || [];
                        userData.scans.push(scanResult);
                        localStorage.setItem('bioshield_user', JSON.stringify(userData));
                        updateDashboardData(userData);
                    }

                    // Display the analysis result
                    displayAnalysisResult(analysisResult);

                    showSuccessMessage(`Ingredient analysis complete! Health Score: ${analysisResult.healthScore}/10`);
                }, 2000);
            });
        }
        
        if (uploadArea) {
            const fileInput = document.getElementById('fileInput');
            const uploadPlaceholder = document.getElementById('uploadPlaceholder');
            const uploadText = document.getElementById('uploadText');
            const uploadIcon = document.getElementById('uploadIcon');
            const uploadProgress = document.getElementById('uploadProgress');
            const uploadProgressBar = document.getElementById('uploadProgressBar');

            // Click to upload
            uploadArea.addEventListener('click', function() {
                fileInput.click();
            });

            // File selection handling
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleFileUpload(file);
                }
            });

            // Drag and drop functionality
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    handleFileUpload(files[0]);
                }
            });

            function handleFileUpload(file) {
                // Update UI to show selected file
                uploadText.textContent = file.name + ' selected';
                uploadIcon.textContent = '🖼️';
                uploadPlaceholder.classList.add('has-file');
                uploadArea.classList.add('uploading');

                // Show progress bar
                uploadProgress.style.display = 'block';

                // Simulate upload progress
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += Math.random() * 30;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(progressInterval);
                        uploadProgressBar.style.width = '100%';

                        // Complete upload after a brief delay
                        setTimeout(() => {
                            completeUpload(file);
                        }, 500);
                    } else {
                        uploadProgressBar.style.width = progress + '%';
                    }
                }, 200);
            }

            function completeUpload(file) {
                uploadArea.classList.remove('uploading');
                uploadArea.classList.add('uploaded');
                uploadProgress.style.display = 'none';
                uploadProgressBar.style.width = '0%';

                // Analyze the ingredients
                setTimeout(() => {
                    const analysisResult = generateIngredientAnalysis();
                    const userData = JSON.parse(localStorage.getItem('bioshield_user'));

                    const scanResult = {
                        id: generateId(),
                        productName: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                        healthScore: analysisResult.healthScore,
                        timestamp: new Date().toISOString(),
                        pros: analysisResult.pros,
                        cons: analysisResult.cons,
                        redFlags: analysisResult.redFlags,
                        greenFlags: analysisResult.greenFlags,
                        alternatives: analysisResult.alternatives,
                        cookingTips: analysisResult.cookingTips,
                        riskLevel: analysisResult.riskLevel
                    };

                    if (userData) {
                        userData.scans = userData.scans || [];
                        userData.scans.push(scanResult);
                        localStorage.setItem('bioshield_user', JSON.stringify(userData));
                        updateDashboardData(userData);
                    }

                    // Update result display
                    displayAnalysisResult(analysisResult);

                    // Show success message
                    showSuccessMessage(`${file.name} analyzed successfully! Score: ${analysisResult.healthScore}/10`);

                    // Reset upload area after a delay
                    setTimeout(() => {
                        resetUploadArea();
                    }, 5000);
                }, 1000);
            }

            function generateIngredientAnalysis() {
                // Simulate comprehensive ingredient analysis
                const healthScore = Math.floor(Math.random() * 10) + 1;

                const possiblePros = [
                    'Rich in natural vitamins and minerals',
                    'Contains beneficial antioxidants',
                    'Good source of dietary fiber',
                    'Low in saturated fats',
                    'No artificial preservatives',
                    'Organic ingredients used',
                    'High protein content',
                    'Contains omega-3 fatty acids',
                    'Natural flavor enhancers',
                    'Supports heart health'
                ];

                const possibleCons = [
                    'High sodium content',
                    'Contains refined sugars',
                    'Artificial colors added',
                    'High in saturated fats',
                    'Contains preservatives',
                    'Processed ingredients',
                    'High calorie density',
                    'Potential allergens present',
                    'Contains trans fats',
                    'Excessive added sugars'
                ];

                const possibleRedFlags = [
                    'Trans fats', 'High sodium', 'Artificial colors', 'Preservatives',
                    'Refined sugars', 'Corn syrup', 'MSG', 'Nitrates'
                ];

                const possibleGreenFlags = [
                    'Organic', 'No preservatives', 'Whole grains', 'Vitamin enriched',
                    'Natural flavors', 'Antioxidants', 'Fiber rich', 'Omega-3'
                ];

                const possibleAlternatives = [
                    { name: 'Organic version of this product', score: '8.5' },
                    { name: 'Homemade equivalent recipe', score: '9.2' },
                    { name: 'Similar product with better ingredients', score: '7.8' },
                    { name: 'Plant-based alternative', score: '8.0' }
                ];

                const possibleTips = [
                    'Steam instead of frying to retain nutrients',
                    'Add fresh herbs to boost antioxidant content',
                    'Pair with fiber-rich vegetables',
                    'Use minimal oil during preparation',
                    'Add lemon juice to enhance iron absorption',
                    'Choose low-sodium cooking methods',
                    'Incorporate into balanced meals'
                ];

                return {
                    healthScore: healthScore,
                    pros: possiblePros.sort(() => 0.5 - Math.random()).slice(0, 3),
                    cons: possibleCons.sort(() => 0.5 - Math.random()).slice(0, 3),
                    redFlags: possibleRedFlags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1),
                    greenFlags: possibleGreenFlags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1),
                    alternatives: possibleAlternatives.sort(() => 0.5 - Math.random()).slice(0, 2),
                    cookingTips: possibleTips.sort(() => 0.5 - Math.random()).slice(0, 3),
                    riskLevel: healthScore >= 7 ? 'low' : healthScore >= 4 ? 'medium' : 'high'
                };
            }

            function displayAnalysisResult(result) {
                // Update the simple sidebar display first
                const resultStatus = document.querySelector('.result-status');
                const simpleResults = document.getElementById('simpleResults');
                const quickScore = document.getElementById('quickScore');
                const quickScoreText = document.getElementById('quickScoreText');
                const scoreBadge = document.getElementById('scoreBadge');

                // Show demo analysis results in the sidebar
                showDemoAnalysisResults(result);

                // Update status
                if (resultStatus) {
                    let statusText = `Analysis complete`;
                    let bgColor = '#dcfce7';
                    let textColor = '#166534';

                    if (result.healthScore < 4) {
                        bgColor = '#fecaca';
                        textColor = '#dc2626';
                        statusText += ' - Poor Quality Detected';
                    } else if (result.healthScore < 7) {
                        bgColor = '#fef3c7';
                        textColor = '#92400e';
                        statusText += ' - Average Quality';
                    } else {
                        statusText += ' - Excellent Quality!';
                    }

                    resultStatus.textContent = statusText;
                    resultStatus.style.background = bgColor;
                    resultStatus.style.color = textColor;
                }

                // Show simple results
                if (simpleResults) {
                    simpleResults.style.display = 'flex';
                }

                // Update quick score
                if (quickScore) {
                    quickScore.textContent = result.healthScore;
                }

                // Update score badge color
                if (scoreBadge) {
                    let borderColor = '#22c55e'; // Green

                    if (result.healthScore < 4) {
                        borderColor = '#ef4444'; // Red
                    } else if (result.healthScore < 7) {
                        borderColor = '#f59e0b'; // Yellow
                    }

                    scoreBadge.style.borderColor = borderColor;
                }
            }

            function resetUploadArea() {
                uploadArea.classList.remove('uploaded', 'uploading');
                uploadPlaceholder.classList.remove('has-file');
                uploadText.textContent = 'Choose File | No file chosen';
                uploadIcon.textContent = '📁';
                fileInput.value = '';
            }
        }
    }
    
    // Initialize enhanced scanning
    enhancedScanningSetup();
    
    // Learn More button functionality
    const learnMoreBtn = document.querySelector('.btn-secondary');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            const featuresSection = document.querySelector('.features-section');
            if (featuresSection) {
                featuresSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Utility functions
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    function calculateStreak(scans) {
        if (!scans.length) return 0;
        
        const today = new Date();
        let streak = 0;
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            
            const hasScanOnDate = scans.some(scan => {
                const scanDate = new Date(scan.timestamp);
                return scanDate.toDateString() === checkDate.toDateString();
            });
            
            if (hasScanOnDate) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    function timeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInMinutes = Math.floor((now - past) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
    
    function showSuccessMessage(message) {
        showMessage(message, 'success');
    }
    
    function showErrorMessage(message) {
        showMessage(message, 'error');
    }
    
    function showMessage(message, type) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style the toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Full-screen analysis modal functionality
    function showAnalysisModal(result) {
        const analysisModal = document.getElementById('analysisModal');
        const analysisClose = document.getElementById('analysisClose');

        // Show modal
        analysisModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Update modal content
        updateModalContent(result);

        // Close modal functionality
        analysisClose.addEventListener('click', hideAnalysisModal);
        analysisModal.addEventListener('click', (e) => {
            if (e.target === analysisModal) hideAnalysisModal();
        });

        // ESC key to close
        document.addEventListener('keydown', handleEscKey);
    }

    function hideAnalysisModal() {
        const analysisModal = document.getElementById('analysisModal');
        analysisModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleEscKey);
    }

    function handleEscKey(e) {
        if (e.key === 'Escape') {
            hideAnalysisModal();
        }
    }

    function updateModalContent(result) {
        // Update large health score
        const healthScoreLarge = document.getElementById('healthScoreLarge');
        const scoreCircleLarge = document.getElementById('scoreCircleLarge');
        const scoreStatus = document.getElementById('scoreStatus');

        if (healthScoreLarge) {
            healthScoreLarge.textContent = result.healthScore;
            const angle = (result.healthScore / 10) * 360;
            let color = '#22c55e'; // Green

            if (result.healthScore < 4) {
                color = '#ef4444'; // Red
            } else if (result.healthScore < 7) {
                color = '#f59e0b'; // Yellow
            }

            scoreCircleLarge.style.setProperty('--score-angle', `${angle}deg`);
            scoreCircleLarge.style.background = `conic-gradient(${color} 0deg, ${color} ${angle}deg, #e2e8f0 ${angle}deg)`;
        }

        if (scoreStatus) {
            let statusText = `Health Score: ${result.healthScore}/10`;
            if (result.healthScore >= 7) {
                statusText += ' - Excellent Choice!';
            } else if (result.healthScore >= 4) {
                statusText += ' - Consider Alternatives';
            } else {
                statusText += ' - Avoid This Product';
            }
            scoreStatus.textContent = statusText;
        }

        // Update pros
        const prosListLarge = document.getElementById('prosListLarge');
        if (prosListLarge) {
            prosListLarge.innerHTML = result.pros.map(pro => `<li>${pro}</li>`).join('');
        }

        // Update cons
        const consListLarge = document.getElementById('consListLarge');
        if (consListLarge) {
            consListLarge.innerHTML = result.cons.map(con => `<li>${con}</li>`).join('');
        }

        // Update red flags
        const redFlagsLarge = document.getElementById('redFlagsLarge');
        if (redFlagsLarge) {
            redFlagsLarge.innerHTML = result.redFlags.map(flag => `<span class="flag-tag red">${flag}</span>`).join('');
        }

        // Update green flags
        const greenFlagsLarge = document.getElementById('greenFlagsLarge');
        if (greenFlagsLarge) {
            greenFlagsLarge.innerHTML = result.greenFlags.map(flag => `<span class="flag-tag green">${flag}</span>`).join('');
        }

        // Update alternatives
        const alternativesListLarge = document.getElementById('alternativesListLarge');
        if (alternativesListLarge) {
            alternativesListLarge.innerHTML = result.alternatives.map(alt => `
                <div class="alternative-item-large">
                    <span class="alt-name-large">${alt.name}</span>
                    <span class="alt-score-large">${alt.score}/10</span>
                </div>
            `).join('');
        }

        // Update cooking tips
        const cookingTipsLarge = document.getElementById('cookingTipsLarge');
        if (cookingTipsLarge) {
            cookingTipsLarge.innerHTML = result.cookingTips.map(tip => `<div class="tip-item-large">${tip}</div>`).join('');
        }
    }

    // Inline analysis functionality
    function showInlineAnalysis(result) {
        const inlineSection = document.getElementById('inlineAnalysisSection');

        // Show the section
        inlineSection.style.display = 'block';

        // Scroll to the analysis section
        setTimeout(() => {
            inlineSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);

        // Update content
        updateInlineContent(result);
    }

    function updateInlineContent(result) {
        // Update health score
        const healthScoreInline = document.getElementById('healthScoreInline');
        const scoreCircleInline = document.getElementById('scoreCircleInline');
        const scoreTitleInline = document.getElementById('scoreTitleInline');
        const scoreSubtitleInline = document.getElementById('scoreSubtitleInline');

        if (healthScoreInline) {
            healthScoreInline.textContent = result.healthScore;
            const angle = (result.healthScore / 10) * 360;
            let color = '#22c55e'; // Green

            if (result.healthScore < 4) {
                color = '#ef4444'; // Red
            } else if (result.healthScore < 7) {
                color = '#f59e0b'; // Yellow
            }

            scoreCircleInline.style.setProperty('--score-angle', `${angle}deg`);
            scoreCircleInline.style.background = `conic-gradient(${color} 0deg, ${color} ${angle}deg, #e2e8f0 ${angle}deg)`;
        }

        if (scoreTitleInline && scoreSubtitleInline) {
            if (result.healthScore >= 7) {
                scoreTitleInline.textContent = 'Excellent Choice!';
                scoreSubtitleInline.textContent = 'This product has great nutritional value';
            } else if (result.healthScore >= 4) {
                scoreTitleInline.textContent = 'Average Quality';
                scoreSubtitleInline.textContent = 'Consider better alternatives';
            } else {
                scoreTitleInline.textContent = 'Poor Quality';
                scoreSubtitleInline.textContent = 'Avoid this product if possible';
            }
        }

        // Update pros
        const prosListInline = document.getElementById('prosListInline');
        if (prosListInline) {
            prosListInline.innerHTML = result.pros.map(pro => `<li>${pro}</li>`).join('');
        }

        // Update cons
        const consListInline = document.getElementById('consListInline');
        if (consListInline) {
            consListInline.innerHTML = result.cons.map(con => `<li>${con}</li>`).join('');
        }

        // Update red flags
        const redFlagsInline = document.getElementById('redFlagsInline');
        if (redFlagsInline) {
            redFlagsInline.innerHTML = result.redFlags.map(flag => `<span class="flag-tag red">${flag}</span>`).join('');
        }

        // Update green flags
        const greenFlagsInline = document.getElementById('greenFlagsInline');
        if (greenFlagsInline) {
            greenFlagsInline.innerHTML = result.greenFlags.map(flag => `<span class="flag-tag green">${flag}</span>`).join('');
        }

        // Update alternatives
        const alternativesListInline = document.getElementById('alternativesListInline');
        if (alternativesListInline) {
            alternativesListInline.innerHTML = result.alternatives.map(alt => `
                <div class="alternative-item-inline">
                    <span class="alt-name-inline">${alt.name}</span>
                    <span class="alt-score-inline">${alt.score}/10</span>
                </div>
            `).join('');
        }

        // Update cooking tips
        const cookingTipsInline = document.getElementById('cookingTipsInline');
        if (cookingTipsInline) {
            cookingTipsInline.innerHTML = result.cookingTips.map(tip => `<div class="tip-item-inline">${tip}</div>`).join('');
        }
    }

    // Demo analysis results functionality
    function showDemoAnalysisResults(result) {
        const demoResults = document.getElementById('demoAnalysisResults');
        const viewDetailedBtn = document.getElementById('viewDetailedBtn');

        // Show the demo results
        demoResults.style.display = 'block';

        // Update demo content
        updateDemoContent(result);

        // Add click handler for detailed view
        if (viewDetailedBtn) {
            viewDetailedBtn.onclick = () => {
                showInlineAnalysis(result);
            };
        }
    }

    function updateDemoContent(result) {
        // Update demo health score
        const demoHealthScore = document.getElementById('demoHealthScore');
        const demoScoreCircle = document.getElementById('demoScoreCircle');
        const demoScoreText = document.getElementById('demoScoreText');

        if (demoHealthScore) {
            demoHealthScore.textContent = result.healthScore;
            const angle = (result.healthScore / 10) * 360;
            let color = '#22c55e'; // Green

            if (result.healthScore < 4) {
                color = '#ef4444'; // Red
            } else if (result.healthScore < 7) {
                color = '#f59e0b'; // Yellow
            }

            demoScoreCircle.style.setProperty('--score-angle', `${angle}deg`);
            demoScoreCircle.style.background = `conic-gradient(${color} 0deg, ${color} ${angle}deg, #e2e8f0 ${angle}deg)`;
        }

        if (demoScoreText) {
            if (result.healthScore >= 7) {
                demoScoreText.textContent = 'Excellent!';
            } else if (result.healthScore >= 4) {
                demoScoreText.textContent = 'Average';
            } else {
                demoScoreText.textContent = 'Poor Quality';
            }
        }

        // Update demo pros (show only first 2)
        const demoProsList = document.getElementById('demoProsList');
        if (demoProsList) {
            demoProsList.innerHTML = result.pros.slice(0, 2).map(pro => `<li>${pro}</li>`).join('');
        }

        // Update demo cons (show only first 2)
        const demoConsList = document.getElementById('demoConsList');
        if (demoConsList) {
            demoConsList.innerHTML = result.cons.slice(0, 2).map(con => `<li>${con}</li>`).join('');
        }

        // Update demo red flags (show only first 3)
        const demoRedFlags = document.getElementById('demoRedFlags');
        if (demoRedFlags) {
            const flags = result.redFlags.slice(0, 3);
            demoRedFlags.innerHTML = flags.length > 0
                ? flags.map(flag => `<span class="flag-tag red">${flag}</span>`).join('')
                : '<span class="flag-tag red">None</span>';
        }

        // Update demo green flags (show only first 3)
        const demoGreenFlags = document.getElementById('demoGreenFlags');
        if (demoGreenFlags) {
            const flags = result.greenFlags.slice(0, 3);
            demoGreenFlags.innerHTML = flags.length > 0
                ? flags.map(flag => `<span class="flag-tag green">${flag}</span>`).join('')
                : '<span class="flag-tag green">None</span>';
        }
    }

    // Make functions available globally
    window.showMainContent = showMainContent;
    window.hideAnalysisModal = hideAnalysisModal;
    
    // Initialize smooth loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
