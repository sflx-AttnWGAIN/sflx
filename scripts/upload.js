// Upload Page JavaScript for AttnWGAIN

document.addEventListener('DOMContentLoaded', function() {
    // File upload elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const startButton = document.getElementById('startImputation');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resultsSection = document.getElementById('resultsSection');
    const toggleAdvanced = document.getElementById('toggleAdvanced');

    // Model selection elements
    const modelCards = document.querySelectorAll('.model-card');
    let selectedModel = 'attnwgain';

    // Preset selection elements
    const presetCards = document.querySelectorAll('.preset-card');

    // File upload functionality
    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', function() {
            fileInput.click();
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
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    // Handle file selection
    function handleFileSelect(file) {
        // Validate file type
        const allowedTypes = ['.csv', '.xlsx', '.xls'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            showNotification('请选择 CSV 或 Excel 格式的文件', 'error');
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showNotification('文件大小不能超过 10MB', 'error');
            return;
        }

        // Display file info
        fileName.textContent = file.name;
        fileSize.textContent = utils.formatFileSize(file.size);
        fileInfo.style.display = 'block';
        uploadArea.style.display = 'none';

        // Enable start button
        startButton.disabled = false;
        
        showNotification('文件上传成功！', 'success');
    }

    // Remove file
    window.removeFile = function() {
        fileInput.value = '';
        fileInfo.style.display = 'none';
        uploadArea.style.display = 'block';
        startButton.disabled = true;
        showNotification('文件已移除', 'info');
    };

    // Model selection
    modelCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            modelCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Update selected model
            selectedModel = this.getAttribute('data-model');
            
            showNotification(`已选择 ${this.querySelector('h3').textContent} 模型`, 'info');
        });
    });

    // Preset selection mapping to parameters
    const presetToParams = {
        'duration': { missingRate: '20', batchSize: '64', epochs: '200' },
        'multivariate': { missingRate: '20', batchSize: '128', epochs: '300' },
        'high-missing': { missingRate: '40', batchSize: '64', epochs: '300' }
    };

    // Apply preset selection
    presetCards.forEach(card => {
        card.addEventListener('click', function() {
            // UI active state
            presetCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // Map to parameters
            const key = this.getAttribute('data-preset');
            const preset = presetToParams[key];
            if (preset) {
                document.getElementById('missingRate').value = preset.missingRate;
                document.getElementById('batchSize').value = preset.batchSize;
                document.getElementById('epochs').value = preset.epochs;
                showNotification(`已应用预设：${this.querySelector('h4').textContent}`, 'info');
            }
        });
    });

    // Toggle advanced parameter panel
    if (toggleAdvanced) {
        toggleAdvanced.addEventListener('click', function(e) {
            e.preventDefault();
            const panel = document.querySelector('.parameter-hidden');
            if (panel) {
                const isHidden = panel.style.display === 'none' || panel.style.display === '';
                panel.style.display = isHidden ? 'block' : 'none';
                this.innerHTML = isHidden ? '<i class="fas fa-sliders-h"></i> 收起参数' : '<i class="fas fa-sliders-h"></i> 高级参数';
            }
        });
    }

    // Start imputation process
    if (startButton) {
        startButton.addEventListener('click', function() {
            if (!fileInput.files[0]) {
                showNotification('请先上传文件', 'error');
                return;
            }

            // Get parameters
            const missingRate = document.getElementById('missingRate').value;
            const batchSize = document.getElementById('batchSize').value;
            const epochs = document.getElementById('epochs').value;

            // Show progress section
            progressSection.style.display = 'block';
            startButton.style.display = 'none';

            // Simulate imputation process
            simulateImputation(missingRate, batchSize, epochs);
        });
    }

    // Simulate imputation process
    function simulateImputation(missingRate, batchSize, epochs) {
        const steps = [
            { text: '正在上传文件...', duration: 2000 },
            { text: '正在预处理数据...', duration: 3000 },
            { text: '正在训练模型...', duration: 5000 },
            { text: '正在执行数据填补...', duration: 4000 },
            { text: '正在生成结果...', duration: 2000 }
        ];

        let currentStep = 0;
        let totalProgress = 0;

        function updateProgress() {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                const stepProgress = (Date.now() - stepStartTime) / step.duration;
                const overallProgress = ((currentStep + stepProgress) / steps.length) * 100;
                
                progressFill.style.width = Math.min(overallProgress, 100) + '%';
                progressText.textContent = step.text;

                if (stepProgress >= 1) {
                    currentStep++;
                    if (currentStep < steps.length) {
                        stepStartTime = Date.now();
                    } else {
                        // Process completed
                        setTimeout(() => {
                            progressSection.style.display = 'none';
                            resultsSection.style.display = 'block';
                            showNotification('数据填补完成！', 'success');
                        }, 500);
                    }
                } else {
                    requestAnimationFrame(updateProgress);
                }
            }
        }

        const stepStartTime = Date.now();
        updateProgress();
    }

    // Download results
    window.downloadResults = function() {
        // Create sample data for download
        const sampleData = `timestamp,original_value,imputed_value,difference,status
2024-01-01 00:00:00,25.6,25.6,0.0,original
2024-01-01 00:01:00,25.8,25.8,0.0,original
2024-01-01 00:02:00,NaN,25.7,0.1,imputed
2024-01-01 00:03:00,26.1,26.1,0.0,original
2024-01-01 00:04:00,NaN,25.9,0.2,imputed`;

        const blob = new Blob([sampleData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attnwgain_results.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showNotification('结果文件已下载', 'success');
    };

    // Form validation
    const parameterInputs = document.querySelectorAll('.form-select');
    parameterInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateParameters();
        });
    });

    function validateParameters() {
        const missingRate = document.getElementById('missingRate').value;
        const batchSize = document.getElementById('batchSize').value;
        const epochs = document.getElementById('epochs').value;

        let isValid = true;
        let message = '';

        if (missingRate > 50) {
            message = '缺失率过高可能影响填补效果';
            isValid = false;
        }

        if (batchSize > 256) {
            message = '批次大小过大可能影响处理速度';
            isValid = false;
        }

        if (epochs > 500) {
            message = '训练轮数过多可能影响处理时间';
            isValid = false;
        }

        if (!isValid) {
            showNotification(message, 'warning');
        }
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + U for file upload
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            fileInput.click();
        }

        // Enter to start imputation
        if (e.key === 'Enter' && !startButton.disabled) {
            startButton.click();
        }
    });

    // Add file preview functionality
    function previewFile(file) {
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const lines = content.split('\n').slice(0, 5); // Show first 5 lines
                console.log('File preview:', lines.join('\n'));
            };
            reader.readAsText(file);
        }
    }

    // Add file validation feedback
    function validateFile(file) {
        const errors = [];
        
        if (file.size > 10 * 1024 * 1024) {
            errors.push('文件大小超过 10MB 限制');
        }
        
        const allowedExtensions = ['.csv', '.xlsx', '.xls'];
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            errors.push('不支持的文件格式');
        }
        
        return errors;
    }

    // Add progress animation
    function animateProgress(targetProgress) {
        const currentProgress = parseFloat(progressFill.style.width) || 0;
        const increment = (targetProgress - currentProgress) / 50;
        
        function update() {
            const current = parseFloat(progressFill.style.width) || 0;
            if (current < targetProgress) {
                progressFill.style.width = (current + increment) + '%';
                requestAnimationFrame(update);
            } else {
                progressFill.style.width = targetProgress + '%';
            }
        }
        
        update();
    }

    // Add error handling
    window.addEventListener('error', function(e) {
        console.error('Upload error:', e.error);
        showNotification('处理过程中出现错误，请重试', 'error');
        progressSection.style.display = 'none';
        startButton.style.display = 'block';
    });

    // Add success callback
    window.onImputationSuccess = function(results) {
        console.log('Imputation results:', results);
        showNotification('数据填补成功完成！', 'success');
    };

    // Add failure callback
    window.onImputationFailure = function(error) {
        console.error('Imputation failed:', error);
        showNotification('数据填补失败，请检查文件格式和参数设置', 'error');
        progressSection.style.display = 'none';
        startButton.style.display = 'block';
    };

    console.log('Upload page JavaScript loaded successfully!');
}); 