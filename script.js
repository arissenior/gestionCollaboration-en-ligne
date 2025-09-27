
 // État de l'application
        let currentUser = null;
        let isLoggedIn = false;
        let darkMode = false;
        let isAdmin = false;
        let currentGroup = null;
        let invitations = [];
        let userActivity = [];

        // Données des groupes
        const groupsData = {
            'projet-alpha': {
                name: 'Projet Alpha',
                description: 'Développement du nouveau produit innovant',
                members:  8,
                createdBy: 'Aristide Nna',
                creationDate: '10/05/2023',
                tasks: [
                    { id: 1, title: 'Concevoir la maquette', assignedTo: 'Mbewekam Gaelle', dueDate: '15/06/2023', priority: 'Élevée', completed: false },
                    { id: 2, title: 'Rédiger le cahier des charges', assignedTo: 'Aristide Nna', dueDate: '', priority: '', completed: true },
                    { id: 3, title: 'Développer le module d\'authentification', assignedTo: 'Massayo Darille', dueDate: '20/06/2023', priority: 'Moyenne', completed: false },
                    { id: 4, title: 'Tests utilisateurs', assignedTo: 'Hamidou aboubakar', dueDate: '25/06/2023', priority: 'Moyenne', completed: false }
                ],
                messages: [
                    { user: 'Mbewekam Gaelle', time: '10:25', content: 'J\'ai terminé la première version de la maquette. Pouvez-vous la vérifier?' },
                    { user: 'Aristide Nna', time: '09:45', content: 'La réunion de suivi est prévue pour demain à 14h. N\'oubliez pas!' },
                    { user: 'Massayo Darille', time: 'Hier, 16:30', content: 'J\'ai rencontré un problème avec l\'API. Quelqu\'un peut m\'aider?' }
                ],
                files: [
                    { name: 'Cahier des charges.pdf', uploadedBy: 'Aristide Nna', date: '12/05/2023', size: '2.4 MB', type: 'pdf' },
                    { name: 'Maquette-v1.png', uploadedBy: 'Mbewekam Gaelle', date: '10/05/2023', size: '1.8 MB', type: 'image' },
                    { name: 'script-authentification.js', uploadedBy: 'Hamidou Aboubakar', date: '08/05/2023', size: '156 KB', type: 'code' }
                ],
                members: [
                    { name: 'Aristide Nna', email: 'aristidenna@gmail.com', role: 'Admin', avatar: 'AN' },
                    { name: 'Mbewekam Gaelle', email: 'gaellembewekam.com', role: 'Membre', avatar: 'GB' },
                    { name: 'Massayo Darille', email: 'darillemassayo@gmail.com', role: 'Membre', avatar: 'DM' },
                    { name: 'Hamidou Aboubakar', email: 'hamidouaboubakar', role: 'Membre', avatar: 'HA' }
                ]
            },
            'equipe-marketing': {
                name: 'Équipe Marketing',
                description: 'Stratégie marketing et communication',
                members: 5,
                createdBy: 'Saidou tupac',
                creationDate: '15/05/2023',
                tasks: [
                    { id: 1, title: 'Créer la campagne publicitaire', assignedTo: 'Itock Fodock', dueDate: '30/06/2023', priority: 'Élevée', completed: false }
                ],
                messages: [],
                files: [],
                members: [
                    { name: 'Aristide Nna', email: 'aristidenna@gmail.com', role: 'Admin', avatar: 'AN' },
                    { name: 'Itock Fodock', email: 'itockfodoc@gmail.com', role: 'Membre', avatar: 'IT' }
                ]
            },
            'developpeurs-web': {
                name: 'Développeurs Web',
                description: 'Équipe de développement front-end et back-end',
                members: 7,
                createdBy: 'Engoulou Dyllan',
                creationDate: '20/05/2023',
                tasks: [],
                messages: [],
                files: [],
                members: [
                    { name: 'Pierre Leroy', email: 'pierre.leroy@example.com', role: 'Admin', avatar: 'PL' },
                    { name: 'John Doe', email: 'john.doe@example.com', role: 'Membre', avatar: 'JD' }
                ]
            }
        };

        // Données de recherche
        const searchData = [
            { title: 'Projet Alpha', type: 'Groupe', description: 'Groupe de développement principal' },
            { title: 'Maquette finale', type: 'Tâche', description: 'Concevoir la maquette utilisateur' },
            { title: 'Cahier des charges', type: 'Fichier', description: 'Document de spécifications' },
            { title: 'Réunion d\'équipe', type: 'Événement', description: 'Réunion hebdomadaire' },
            { title: 'Équipe Marketing', type: 'Groupe', description: 'Groupe dédié au marketing' },
            { title: 'Module d\'authentification', type: 'Tâche', description: 'Développer le système de connexion' }
        ];

        // Initialisation de l'application
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });

        function initializeApp() {
            // Gestion des onglets
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.getAttribute('data-tab');
                    switchTab(tabId);
                });
            });

            // Gestion des onglets admin
            document.querySelectorAll('.admin-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.getAttribute('data-tab');
                    switchAdminTab(tabId);
                });
            });

            // Gestion des onglets dashboard
            document.querySelectorAll('.dashboard-tab-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const tabId = this.getAttribute('href').substring(1);
                    switchDashboardTab(tabId);
                });
            });

            // Gestion de la sélection des groupes
            document.getElementById('groupList').addEventListener('click', function(e) {
                const groupItem = e.target.closest('li');
                if (groupItem && !e.target.closest('.group-actions')) {
                    const groupId = groupItem.getAttribute('data-group');
                    selectGroup(groupId);
                }
            });

            // Gestion des boutons d'action des groupes
            document.getElementById('groupList').addEventListener('click', function(e) {
                if (e.target.closest('.group-action-btn')) {
                    const btn = e.target.closest('.group-action-btn');
                    const groupItem = btn.closest('li');
                    const groupId = groupItem.getAttribute('data-group');
                    
                    if (btn.querySelector('.fa-edit')) {
                        editGroup(groupId);
                    } else if (btn.querySelector('.fa-trash')) {
                        deleteGroup(groupId);
                    }
                }
            });

            // Gestion de l'ajout de nouvelles tâches
            document.getElementById('addTaskBtn').addEventListener('click', addNewTask);
            document.getElementById('newTaskInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addNewTask();
                }
            });

            // Gestion de l'ajout de nouveaux messages
            document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
            document.getElementById('newMessageInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Gestion du téléversement de fichiers
            document.getElementById('uploadFileBtn').addEventListener('click', uploadFile);

            // Gestion des modales
            document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
            document.getElementById('signupBtn').addEventListener('click', () => openModal('signupModal'));
            document.getElementById('createGroupBtn').addEventListener('click', () => openModal('createGroupModal'));
            document.getElementById('inviteMemberBtn').addEventListener('click', () => openModal('inviteMemberModal'));

            document.querySelectorAll('.close-modal').forEach(button => {
                button.addEventListener('click', closeModal);
            });

            // Gestion des formulaires
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            document.getElementById('signupForm').addEventListener('submit', handleSignup);
            document.getElementById('createGroupForm').addEventListener('submit', handleCreateGroup);
            document.getElementById('inviteMemberForm').addEventListener('submit', handleInviteMember);
            document.getElementById('saveGroupSettings').addEventListener('click', saveGroupSettings);

            // Gestion du thème sombre
            document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);

            // Gestion du menu mobile
            document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);

            // Gestion de la recherche
            document.getElementById('searchInput').addEventListener('input', handleSearch);
            document.getElementById('searchInput').addEventListener('focus', showSearchResults);
            document.getElementById('searchInput').addEventListener('blur', hideSearchResults);

            // Gestion du menu utilisateur
            document.getElementById('userAvatar').addEventListener('click', toggleUserDropdown);

            // Gestion de la déconnexion
            document.getElementById('logoutBtn').addEventListener('click', handleLogout);

            // Gestion de la navigation admin
            document.querySelectorAll('.admin-nav').forEach(link => {
                link.addEventListener('click', showAdminSection);
            });

            // Gestion de la navigation dashboard
            document.querySelectorAll('.dashboard-nav-link').forEach(link => {
                link.addEventListener('click', showDashboardSection);
            });

            // Validation en temps réel des formulaires
            setupFormValidation();

            // Initialiser le calendrier
            initializeCalendar();

            // Vérifier si l'utilisateur est déjà connecté (simulation)
            checkLoginStatus();

            // Charger les groupes
            loadGroups();
        }

        function switchTab(tabId) {
            // Retirer la classe active de tous les onglets et contenus
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
            
            // Afficher le contenu correspondant
            document.getElementById(tabId).classList.add('active');
        }

        function switchAdminTab(tabId) {
            // Retirer la classe active de tous les onglets et contenus admin
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            document.querySelector(`.admin-tab[data-tab="${tabId}"]`).classList.add('active');
            
            // Afficher le contenu correspondant
            document.getElementById(tabId).classList.add('active');

            // Charger les données spécifiques à l'onglet
            if (tabId === 'admin-invitations') {
                loadAdminInvitations();
            } else if (tabId === 'admin-users') {
                loadAdminUsers();
            } else if (tabId === 'admin-groups') {
                loadAdminGroups();
            } else if (tabId === 'admin-dashboard') {
                loadAdminDashboard();
            }
        }

        function switchDashboardTab(tabId) {
            // Retirer la classe active de tous les onglets et liens
            document.querySelectorAll('.dashboard-tab-link').forEach(link => link.classList.remove('active'));
            document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            document.querySelector(`.dashboard-tab-link[href="#${tabId}"]`).classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Charger les données spécifiques à l'onglet
            if (tabId === 'progression') {
                loadUserProgress();
            } else if (tabId === 'mes-taches') {
                loadUserTasks();
            } else if (tabId === 'mes-invitations') {
                loadUserInvitations();
            } else if (tabId === 'statistiques') {
                loadUserStatistics();
            }
        }

        function loadGroups() {
            const groupList = document.getElementById('groupList');
            groupList.innerHTML = '';

            for (const groupId in groupsData) {
                const group = groupsData[groupId];
                const groupItem = document.createElement('li');
                groupItem.setAttribute('data-group', groupId);
                groupItem.innerHTML = `
                    <div>
                        <i class="fas fa-users"></i> ${group.name}
                    </div>
                    <div class="group-actions">
                        <button class="group-action-btn" title="Modifier"><i class="fas fa-edit"></i></button>
                        <button class="group-action-btn" title="Supprimer"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                groupList.appendChild(groupItem);
            }

            // Sélectionner le premier groupe par défaut
            const firstGroup = document.querySelector('.group-list li');
            if (firstGroup) {
                const firstGroupId = firstGroup.getAttribute('data-group');
                selectGroup(firstGroupId);
            }
        }

        function selectGroup(groupId) {
            currentGroup = groupId;
            
            // Mettre à jour la sélection visuelle
            document.querySelectorAll('.group-list li').forEach(li => li.classList.remove('active'));
            document.querySelector(`.group-list li[data-group="${groupId}"]`).classList.add('active');
            
            // Charger les données du groupe
            const group = groupsData[groupId];
            document.getElementById('groupTitle').textContent = group.name;
            document.getElementById('memberCount').textContent = group.members;
            document.getElementById('groupName').value = group.name;
            document.getElementById('groupDescription').value = group.description;
            
            // Mettre à jour les tâches
            updateTasksDisplay(group.tasks);
            
            // Mettre à jour les messages
            updateMessagesDisplay(group.messages);
            
            // Mettre à jour les fichiers
            updateFilesDisplay(group.files);
            
            // Mettre à jour les membres
            updateMembersDisplay(group.members);
            
            // Mettre à jour le calendrier
            updateCalendarDisplay(groupId);
        }

        function editGroup(groupId) {
            const group = groupsData[groupId];
            showNotification(`Modification du groupe "${group.name}"`, 'warning');
        }

        function deleteGroup(groupId) {
            const group = groupsData[groupId];
            if (confirm(`Êtes-vous sûr de vouloir supprimer le groupe "${group.name}" ?`)) {
                delete groupsData[groupId];
                document.querySelector(`.group-list li[data-group="${groupId}"]`).remove();
                showNotification(`Groupe "${group.name}" supprimé avec succès`, 'success');
                
                // Sélectionner le premier groupe disponible
                const firstGroup = document.querySelector('.group-list li');
                if (firstGroup) {
                    const firstGroupId = firstGroup.getAttribute('data-group');
                    selectGroup(firstGroupId);
                } else {
                    // Aucun groupe restant
                    document.getElementById('groupTitle').textContent = 'Aucun groupe';
                    document.getElementById('memberCount').textContent = '0';
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.innerHTML = '<p>Aucun groupe disponible. Créez un nouveau groupe pour commencer.</p>';
                    });
                }
            }
        }

        function updateTasksDisplay(tasks) {
            const tasksContainer = document.getElementById('groupTasksList');
            tasksContainer.innerHTML = '';
            
            // Ajouter chaque tâche
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task-item';
                taskElement.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <div class="task-info">
                        <h4>${task.title}</h4>
                        <p>Assignée à: ${task.assignedTo} ${task.dueDate ? '• Échéance: ' + task.dueDate : ''} ${task.priority ? '• Priorité: ' + task.priority : ''}</p>
                    </div>
                    <div class="task-actions">
                        <button title="Modifier"><i class="fas fa-edit"></i></button>
                        <button title="Supprimer"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                tasksContainer.appendChild(taskElement);
            });
            
            // Ajouter les écouteurs d'événements pour les tâches
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const taskItem = this.closest('.task-item');
                    const taskTitle = taskItem.querySelector('h4').textContent;
                    
                    if (this.checked) {
                        showNotification(`Tâche "${taskTitle}" marquée comme terminée`, 'success');
                        // Mettre à jour la progression de l'utilisateur
                        if (currentUser && task.assignedTo === currentUser.name) {
                            loadUserProgress();
                        }
                    } else {
                        showNotification(`Tâche "${taskTitle}" marquée comme non terminée`, 'warning');
                    }
                });
            });
            
            // Ajouter les écouteurs d'événements pour les boutons d'action des tâches
            document.querySelectorAll('.task-actions button').forEach(button => {
                button.addEventListener('click', function() {
                    const taskItem = this.closest('.task-item');
                    const taskTitle = taskItem.querySelector('h4').textContent;
                    
                    if (this.querySelector('.fa-edit')) {
                        showNotification(`Modification de la tâche "${taskTitle}"`, 'warning');
                    } else if (this.querySelector('.fa-trash')) {
                        if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${taskTitle}" ?`)) {
                            taskItem.remove();
                            showNotification(`Tâche "${taskTitle}" supprimée avec succès`, 'success');
                        }
                    }
                });
            });
        }

        function updateMessagesDisplay(messages) {
            const messagesContainer = document.getElementById('groupMessagesList');
            messagesContainer.innerHTML = '';
            
            // Ajouter chaque message
            messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = 'message-item';
                messageElement.innerHTML = `
                    <div class="message-info">
                        <h4>${message.user} <span>${message.time}</span></h4>
                        <p>${message.content}</p>
                    </div>
                `;
                messagesContainer.appendChild(messageElement);
            });
        };

        function updateFilesDisplay(files) {
            const filesContainer = document.getElementById('groupFilesList');
            filesContainer.innerHTML = '';
            
            // Ajouter chaque fichier
            files.forEach(file => {
                let iconClass = 'fa-file';
                let iconColor = '#6c757d';
                
                switch(file.type) {
                    case 'pdf':
                        iconClass = 'fa-file-pdf';
                        iconColor = '#e74c3c';
                        break;
                    case 'image':
                        iconClass = 'fa-file-image';
                        iconColor = '#3498db';
                        break;
                    case 'code':
                        iconClass = 'fa-file-code';
                        iconColor = '#f39c12';
                        break;
                }
                
                const fileElement = document.createElement('div');
                fileElement.className = 'file-item';
                fileElement.innerHTML = `
                    <i class="fas ${iconClass}" style="color: ${iconColor}; font-size: 1.5rem; margin-right: 15px;"></i>
                    <div class="file-info">
                        <h4>${file.name}</h4>
                        <p>Ajouté par: ${file.uploadedBy} • ${file.date} • ${file.size}</p>
                    </div>
                    <div class="file-actions">
                        <button title="Télécharger"><i class="fas fa-download"></i></button>
                        <button title="Supprimer"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                filesContainer.appendChild(fileElement);
            })
            
            // Ajouter les écouteurs d'événements pour les boutons d'action des fichiers
            document.querySelectorAll('.file-actions button').forEach(button => {
                button.addEventListener('click', function() {
                    const fileItem = this.closest('.file-item');
                    const fileName = fileItem.querySelector('h4').textContent;
                    
                    if (this.querySelector('.fa-download')) {
                        showNotification(`Téléchargement du fichier "${fileName}"`, 'success');
                    } else if (this.querySelector('.fa-trash')) {
                        if (confirm(`Êtes-vous sûr de vouloir supprimer le fichier "${fileName}" ?`)) {
                            fileItem.remove();
                            showNotification(`Fichier "${fileName}" supprimé avec succès`, 'success');
                        }
                    }
                });
            });
        }

        function updateMembersDisplay(members) {
            const membersContainer = document.getElementById('groupMembersList');
            membersContainer.innerHTML = '';
            
            // Ajouter chaque membre
            members.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.className = 'member-card';
                memberElement.innerHTML = `
                    <div class="member-avatar">${member.avatar}</div>
                    <span class="member-role">${member.role}</span>
                    <h4>${member.name}</h4>
                    <p>${member.email}</p>
                    <div class="member-actions">
                        <button class="btn btn-sm btn-primary"><i class="fas fa-envelope"></i></button>
                        <button class="btn btn-sm btn-danger"><i class="fas fa-user-times"></i></button>
                    </div>
                `;
                membersContainer.appendChild(memberElement);
            });
            
            // Ajouter les écouteurs d'événements pour les boutons d'action des membres
            document.querySelectorAll('.member-actions button').forEach(button => {
                button.addEventListener('click', function() {
                    const memberCard = this.closest('.member-card');
                    const memberName = memberCard.querySelector('h4').textContent;
                    
                    if (this.querySelector('.fa-envelope')) {
                        showNotification(`Message envoyé à ${memberName}`, 'success');
                    } else if (this.querySelector('.fa-user-times')) {
                        if (confirm(`Êtes-vous sûr de vouloir retirer ${memberName} du groupe ?`)) {
                            showNotification(`${memberName} a été retiré du groupe`, 'success');
                        }
                    }
                });
            });
        }

        function updateCalendarDisplay(groupId) {
            const calendar = document.getElementById('groupCalendar');
            calendar.innerHTML = '';
            
            // En-têtes des jours
            const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
            days.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-header';
                dayHeader.textContent = day;
                calendar.appendChild(dayHeader);
            });
            
            // Jours du mois (simplifié)
            for (let i = 1; i <= 31; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = i;
                
                // Marquer les jours avec des événements (exemple)
                if (i === 15 || i === 20 || i === 25) {
                    dayElement.classList.add('has-event');
                    dayElement.title = 'Événement ce jour';
                    
                    // Ajouter un événement au clic
                    dayElement.addEventListener('click', function() {
                        showNotification(`Événement du ${i} juin: Réunion d'équipe`, 'success');
                    });
                }
                
                calendar.appendChild(dayElement);
            }
        }

        function addNewTask() {
            const input = document.getElementById('newTaskInput');
            const taskText = input.value.trim();
            
            if (taskText !== '') {
                // Ajouter la tâche aux données
                const newTask = {
                    id: groupsData[currentGroup].tasks.length + 1,
                    title: taskText,
                    assignedTo: currentUser.name,
                    dueDate: '',
                    priority: '',
                    completed: false
                };
                
                groupsData[currentGroup].tasks.push(newTask);
                updateTasksDisplay(groupsData[currentGroup].tasks);
                input.value = '';
                showNotification('Tâche ajoutée avec succès', 'success');
                
                // Enregistrer l'activité
                logUserActivity(`a ajouté la tâche "${taskText}" dans le groupe ${groupsData[currentGroup].name}`);
            }
        }

        function sendMessage() {
            const input = document.getElementById('newMessageInput');
            const messageText = input.value.trim();
            
            if (messageText !== '') {
                // Ajouter le message aux données
                const now = new Date();
                const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                
                const newMessage = {
                    user: currentUser.name,
                    time: timeString,
                    content: messageText
                };
                
                groupsData[currentGroup].messages.push(newMessage);
                updateMessagesDisplay(groupsData[currentGroup].messages);
                input.value = '';
                showNotification('Message envoyé', 'success');
                
                // Faire défiler vers le bas pour voir le nouveau message
                const messagesContainer = document.getElementById('groupMessagesList');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Enregistrer l'activité
                logUserActivity(`a envoyé un message dans le groupe ${groupsData[currentGroup].name}`);
            }
        }

        function uploadFile() {
            const fileInput = document.getElementById('fileUpload');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                showNotification(`Fichier "${file.name}" téléversé avec succès`, 'success');
                fileInput.value = '';
                
                // Enregistrer l'activité
                logUserActivity(`a téléversé un fichier dans le groupe ${groupsData[currentGroup].name}`);
            } else {
                showNotification('Veuillez sélectionner un fichier', 'error');
            }
        }

        function saveGroupSettings() {
            const name = document.getElementById('groupName').value;
            const description = document.getElementById('groupDescription').value;
            const visibility = document.getElementById('groupVisibility').value;
            const notifications = document.getElementById('notificationSettings').value;
            
            if (name) {
                groupsData[currentGroup].name = name;
                groupsData[currentGroup].description = description;
                groupsData[currentGroup].visibility = visibility;
                
                document.getElementById('groupTitle').textContent = name;
                showNotification('Paramètres du groupe enregistrés avec succès', 'success');
                
                // Enregistrer l'activité
                logUserActivity(`a modifié les paramètres du groupe ${name}`);
            } else {
                showNotification('Veuillez saisir un nom pour le groupe.', 'error');
            }
        }

        function handleInviteMember(e) {
            e.preventDefault();
            const email = document.getElementById('inviteeEmail').value;
            const message = document.getElementById('invitationMessage').value;
            
            // Validation
            if (!validateEmail(email)) {
                document.getElementById('inviteeEmail').parentElement.classList.add('error');
                return;
            }
            
            // Créer l'invitation
            const invitation = {
                id: invitations.length + 1,
                groupId: currentGroup,
                groupName: groupsData[currentGroup].name,
                inviter: currentUser.name,
                inviterEmail: currentUser.email,
                inviteeEmail: email,
                message: message,
                status: 'pending',
                date: new Date().toLocaleDateString('fr-FR')
            };
            
            invitations.push(invitation);
            closeModal();
            showNotification('Invitation envoyée. En attente de validation par l\'administrateur.', 'info');
            
            // Enregistrer l'activité
            logUserActivity(`a invité ${email} à rejoindre le groupe ${groupsData[currentGroup].name}`);
        }

        function loadUserProgress() {
            if (!currentUser) return;
            
            // Calculer les statistiques de progression
            let totalTasks = 0;
            let completedTasks = 0;
            
            for (const groupId in groupsData) {
                const group = groupsData[groupId];
                const userTasks = group.tasks.filter(task => task.assignedTo === currentUser.name);
                totalTasks += userTasks.length;
                completedTasks += userTasks.filter(task => task.completed).length;
            }
            
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            // Mettre à jour l'interface
            document.getElementById('totalTasks').textContent = totalTasks;
            document.getElementById('completedTasks').textContent = completedTasks;
            document.getElementById('completionRate').textContent = completionRate + '%';
            
            // Mettre à jour la progression par groupe
            const groupProgressContainer = document.getElementById('groupProgress');
            groupProgressContainer.innerHTML = '';
            
            for (const groupId in groupsData) {
                const group = groupsData[groupId];
                const userTasks = group.tasks.filter(task => task.assignedTo === currentUser.name);
                const groupCompleted = userTasks.filter(task => task.completed).length;
                const groupTotal = userTasks.length;
                const groupRate = groupTotal > 0 ? Math.round((groupCompleted / groupTotal) * 100) : 0;
                
                const progressItem = document.createElement('div');
                progressItem.style.marginBottom = '15px';
                progressItem.innerHTML = `
                    <div style="display: flex; justify-content: between; margin-bottom: 5px;">
                        <span>${group.name}</span>
                        <span>${groupCompleted}/${groupTotal} (${groupRate}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${groupRate}%"></div>
                    </div>
                `;
                groupProgressContainer.appendChild(progressItem);
            }
        }

        function loadUserTasks() {
            if (!currentUser) return;
            
            const tasksList = document.getElementById('userTasksList');
            tasksList.innerHTML = '';
            
            for (const groupId in groupsData) {
                const group = groupsData[groupId];
                const userTasks = group.tasks.filter(task => task.assignedTo === currentUser.name);
                
                userTasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.className = 'task-item';
                    taskItem.innerHTML = `
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <div class="task-info">
                            <h4>${task.title}</h4>
                            <p>Groupe: ${group.name} • ${task.dueDate ? 'Échéance: ' + task.dueDate : ''} ${task.priority ? '• Priorité: ' + task.priority : ''}</p>
                        </div>
                        <div class="task-actions">
                            <button title="Modifier"><i class="fas fa-edit"></i></button>
                        </div>
                    `;
                    tasksList.appendChild(taskItem);
                });
            }
            
            if (tasksList.children.length === 0) {
                tasksList.innerHTML = '<li class="task-item">Aucune tâche assignée</li>';
            }
        }

        function loadUserInvitations() {
            if (!currentUser) return;
            
            const invitationsList = document.getElementById('userInvitationsList');
            invitationsList.innerHTML = '';
            
            const userInvitations = invitations.filter(inv => inv.inviterEmail === currentUser.email);
            
            userInvitations.forEach(invitation => {
                const invitationItem = document.createElement('li');
                invitationItem.className = 'invitation-item';
                invitationItem.innerHTML = `
                    <div class="invitation-info">
                        <h4>Invitation à ${invitation.groupName}</h4>
                        <p>Invité: ${invitation.inviteeEmail} • Date: ${invitation.date} • Statut: <span class="status-badge status-${invitation.status}">${invitation.status === 'pending' ? 'En attente' : invitation.status === 'approved' ? 'Approuvée' : 'Rejetée'}</span></p>
                    </div>
                `;
                invitationsList.appendChild(invitationItem);
            });
            
            if (invitationsList.children.length === 0) {
                invitationsList.innerHTML = '<li class="invitation-item">Aucune invitation envoyée</li>';
            }
        }

        function loadUserStatistics() {
            if (!currentUser) return;
            
            // Calculer les statistiques
            let groupsCount = 0;
            let messagesSent = 0;
            let filesUploaded = 0;
            
            for (const groupId in groupsData) {
                const group = groupsData[groupId];
                // Vérifier si l'utilisateur est membre du groupe
                if (group.members.some(member => member.email === currentUser.email)) {
                    groupsCount++;
                    messagesSent += group.messages.filter(msg => msg.user === currentUser.name).length;
                }
            }
            
            // Mettre à jour l'interface
            document.getElementById('groupsCount').textContent = groupsCount;
            document.getElementById('messagesSent').textContent = messagesSent;
            document.getElementById('filesUploaded').textContent = filesUploaded;
            
            // Afficher l'activité récente
            const recentActivity = document.getElementById('recentActivity');
            recentActivity.innerHTML = '';
            
            const userActivities = userActivity.filter(activity => activity.user === currentUser.name).slice(-5).reverse();
            
            userActivities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.style.padding = '10px';
                activityItem.style.borderBottom = '1px solid #eee';
                activityItem.innerHTML = `
                    <p>${activity.action}</p>
                    <small>${activity.date}</small>
                `;
                recentActivity.appendChild(activityItem);
            });
            
            if (recentActivity.children.length === 0) {
                recentActivity.innerHTML = '<p>Aucune activité récente</p>';
            }
        }

        function loadAdminInvitations() {
            const invitationsTable = document.getElementById('adminInvitationsTable');
            invitationsTable.innerHTML = '';
            
            invitations.forEach(invitation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${invitation.inviter}</td>
                    <td>${invitation.inviteeEmail}</td>
                    <td>${invitation.groupName}</td>
                    <td>${invitation.date}</td>
                    <td><span class="status-badge status-${invitation.status}">${invitation.status === 'pending' ? 'En attente' : invitation.status === 'approved' ? 'Approuvée' : 'Rejetée'}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${invitation.status === 'pending' ? `
                                <button class="btn btn-sm btn-success approve-invitation" data-id="${invitation.id}"><i class="fas fa-check"></i></button>
                                <button class="btn btn-sm btn-danger reject-invitation" data-id="${invitation.id}"><i class="fas fa-times"></i></button>
                            ` : ''}
                        </div>
                    </td>
                `;
                invitationsTable.appendChild(row);
            });
            
            // Ajouter les écouteurs d'événements pour les boutons d'approbation/rejet
            document.querySelectorAll('.approve-invitation').forEach(btn => {
                btn.addEventListener('click', function() {
                    const invitationId = parseInt(this.getAttribute('data-id'));
                    approveInvitation(invitationId);
                });
            });
            
            document.querySelectorAll('.reject-invitation').forEach(btn => {
                btn.addEventListener('click', function() {
                    const invitationId = parseInt(this.getAttribute('data-id'));
                    rejectInvitation(invitationId);
                });
            });
        }

        function loadAdminUsers() {
            const usersTable = document.getElementById('adminUsersTable');
            usersTable.innerHTML = '';
            
            // Simuler des utilisateurs
            const users = [
                { name: 'John Doe', email: 'john.doe@example.com', role: 'Administrateur', registrationDate: '15/03/2023', status: 'Actif' },
                { name: 'Marie Dupont', email: 'marie.dupont@example.com', role: 'Utilisateur', registrationDate: '22/04/2023', status: 'Actif' },
                { name: 'Jean Martin', email: 'jean.martin@example.com', role: 'Utilisateur', registrationDate: '05/05/2023', status: 'Inactif' }
            ];
            
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.registrationDate}</td>
                    <td><span class="status-badge ${user.status === 'Actif' ? 'status-approved' : 'status-rejected'}">${user.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                `;
                usersTable.appendChild(row);
            });
        }

        function loadAdminGroups() {
            const groupsTable = document.getElementById('adminGroupsTable');
            groupsTable.innerHTML = '';
            
            for (const groupId in groupsData) {
                const group = groupsData[groupId];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${group.name}</td>
                    <td>${group.createdBy}</td>
                    <td>${group.members}</td>
                    <td>${group.creationDate}</td>
                    <td><span class="status-badge status-approved">Actif</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                `;
                groupsTable.appendChild(row);
            }
        }

        function loadAdminDashboard() {
            const activityTable = document.getElementById('adminActivityTable');
            activityTable.innerHTML = '';
            
            // Simuler des activités récentes
            const activities = [
                { user: 'Aristide Nna', action: 'Création d\'un groupe', date: '10/06/2023 14:30', status: 'Réussi' },
                { user: 'Engoulou Dyllan', action: 'Modification de profil', date: '09/06/2023 09:15', status: 'Réussi' },
                { user: 'Mbewekam Gaelle', action: 'Téléversement de fichier', date: '08/06/2023 16:45', status: 'Échec' }
            ];
            
            activities.forEach(activity => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${activity.user}</td>
                    <td>${activity.action}</td>
                    <td>${activity.date}</td>
                    <td><span class="status-badge ${activity.status === 'Réussi' ? 'status-approved' : 'status-rejected'}">${activity.status}</span></td>
                `;
                activityTable.appendChild(row);
            });
        }

        function approveInvitation(invitationId) {
            const invitation = invitations.find(inv => inv.id === invitationId);
            if (invitation) {
                invitation.status = 'approved';
                showNotification(`Invitation approuvée. ${invitation.inviteeEmail} peut maintenant rejoindre le groupe.`, 'success');
                loadAdminInvitations();
            }
        }

        function rejectInvitation(invitationId) {
            const invitation = invitations.find(inv => inv.id === invitationId);
            if (invitation) {
                invitation.status = 'rejected';
                showNotification(`Invitation rejetée.`, 'warning');
                loadAdminInvitations();
            }
        }

        function logUserActivity(action) {
            const activity = {
                user: currentUser.name,
                action: action,
                date: new Date().toLocaleString('fr-FR')
            };
            userActivity.push(activity);
        }

        // Les autres fonctions (openModal, closeModal, handleLogin, etc.) restent similaires à la version précédente
        // Pour des raisons de longueur, je vais inclure seulement les fonctions essentielles modifiées

        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'flex';
        }

        function closeModal() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            
            // Réinitialiser les formulaires
            document.querySelectorAll('form').forEach(form => {
                form.reset();
                // Réinitialiser les états d'erreur
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error');
                });
            });
        }

        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Validation
            let isValid = true;
            
            if (!validateEmail(email)) {
                document.getElementById('loginEmail').parentElement.classList.add('error');
                isValid = false;
            }
            
            if (password.length < 1) {
                document.getElementById('loginPassword').parentElement.classList.add('error');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Simulation de connexion
            if (email && password) {
                // Vérifier si c'est un compte admin
                isAdmin = email === 'admin@collabspace.com';
                
                currentUser = {
                    name: isAdmin ? 'Admin CollabSpace' : 'John Doe',
                    email: email,
                    avatar: isAdmin ? 'AC' : 'JD',
                    role: isAdmin ? 'Administrateur' : 'Utilisateur'
                };
                
                isLoggedIn = true;
                updateUIAfterLogin();
                closeModal();
                showNotification('Connexion réussie!', 'success');
                
                // Rediriger vers le tableau de bord
                setTimeout(() => {
                    showDashboardSection();
                }, 1000);
            } else {
                showNotification('Veuillez remplir tous les champs.', 'error');
            }
        }

        function handleSignup(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            // Validation
            let isValid = true;
            
            if (name.length < 2) {
                document.getElementById('signupName').parentElement.classList.add('error');
                isValid = false;
            }
            
            if (!validateEmail(email)) {
                document.getElementById('signupEmail').parentElement.classList.add('error');
                isValid = false;
            }
            
            if (password.length < 8) {
                document.getElementById('signupPassword').parentElement.classList.add('error');
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                document.getElementById('signupConfirmPassword').parentElement.classList.add('error');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Simulation d'inscription
            if (name && email && password) {
                currentUser = {
                    name: name,
                    email: email,
                    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
                    role: 'Utilisateur'
                };
                isLoggedIn = true;
                updateUIAfterLogin();
                closeModal();
                showNotification('Inscription réussie! Bienvenue sur CollabSpace.', 'success');
            } else {
                showNotification('Veuillez remplir tous les champs.', 'error');
            }
        }

        function handleCreateGroup(e) {
            e.preventDefault();
            const name = document.getElementById('newGroupName').value;
            const description = document.getElementById('newGroupDescription').value;
            const visibility = document.getElementById('newGroupVisibility').value;
            
            // Validation
            if (name.length < 2) {
                document.getElementById('newGroupName').parentElement.classList.add('error');
                return;
            }
            
            if (name) {
                // Ajouter le nouveau groupe aux données
                const groupId = name.toLowerCase().replace(/\s+/g, '-');
                groupsData[groupId] = {
                    name: name,
                    description: description,
                    visibility: visibility,
                    members: 1,
                    createdBy: currentUser.name,
                    creationDate: new Date().toLocaleDateString('fr-FR'),
                    tasks: [],
                    messages: [],
                    files: [],
                    members: [
                        { name: currentUser.name, email: currentUser.email, role: 'Admin', avatar: currentUser.avatar }
                    ]
                };
                
                closeModal();
                showNotification('Groupe créé avec succès!', 'success');
                
                // Recharger les groupes
                loadGroups();
                
                // Sélectionner le nouveau groupe
                selectGroup(groupId);
                
                // Enregistrer l'activité
                logUserActivity(`a créé le groupe ${name}`);
            } else {
                showNotification('Veuillez saisir un nom pour le groupe.', 'error');
            }
        }

        function updateUIAfterLogin() {
            // Masquer les boutons d'authentification
            document.getElementById('authButtons').style.display = 'none';
            
            // Afficher le menu utilisateur
            document.getElementById('userMenu').style.display = 'flex';
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userAvatar').textContent = currentUser.avatar;
            document.querySelector('.user-role').textContent = currentUser.role;
            
            // Mettre à jour le tableau de bord
            document.getElementById('dashboardUserName').textContent = currentUser.name;
            document.getElementById('dashboardUserRole').textContent = currentUser.role;
            document.getElementById('dashboardUserAvatar').textContent = currentUser.avatar;
            
            // Afficher les éléments admin si l'utilisateur est admin
            if (isAdmin) {
                document.querySelectorAll('.admin-nav').forEach(el => {
                    el.style.display = 'flex';
                });
                document.querySelector('.user-role').innerHTML = 'Administrateur <span class="admin-badge">ADMIN</span>';
            }
            
            // Activer les fonctionnalités réservées aux utilisateurs connectés
            document.getElementById('createGroupBtn').disabled = false;
            document.querySelectorAll('.add-item-form input, .add-item-form textarea, .add-item-form button, .add-item-form select').forEach(el => {
                el.disabled = false;
                if (el.placeholder && el.placeholder.includes('Veuillez vous connecter')) {
                    el.placeholder = el.placeholder.replace('Veuillez vous connecter pour utiliser cette fonctionnalité', '');
                }
            });
            
            // Sauvegarder l'état de connexion
            localStorage.setItem('collabspace_loggedIn', 'true');
            localStorage.setItem('collabspace_user', JSON.stringify(currentUser));
            localStorage.setItem('collabspace_isAdmin', isAdmin.toString());
        }

        function checkLoginStatus() {
            // Simulation: vérifier si l'utilisateur est connecté
            const loggedIn = localStorage.getItem('collabspace_loggedIn');
            const userData = localStorage.getItem('collabspace_user');
            const adminStatus = localStorage.getItem('collabspace_isAdmin');
            
            if (loggedIn === 'true' && userData) {
                currentUser = JSON.parse(userData);
                isLoggedIn = true;
                isAdmin = adminStatus === 'true';
                updateUIAfterLogin();
            } else {
                // Désactiver certaines fonctionnalités pour les utilisateurs non connectés
                document.getElementById('createGroupBtn').disabled = true;
                document.querySelectorAll('.add-item-form input, .add-item-form textarea, .add-item-form button, .add-item-form select').forEach(el => {
                    el.disabled = true;
                    if (el.placeholder && !el.placeholder.includes('Veuillez vous connecter')) {
                        el.placeholder = 'Veuillez vous connecter pour utiliser cette fonctionnalité';
                    }
                });
            }
        }

        function toggleDarkMode() {
            darkMode = !darkMode;
            document.body.classList.toggle('dark-mode', darkMode);
            
            // Mettre à jour l'icône
            const icon = document.querySelector('#themeToggle i');
            if (darkMode) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            // Sauvegarder la préférence
            localStorage.setItem('collabspace_darkMode', darkMode);
        }

        function toggleMobileMenu() {
            document.getElementById('navLinks').classList.toggle('active');
        }

        function toggleUserDropdown() {
            document.getElementById('userDropdown').classList.toggle('active');
        }

        function handleLogout() {
            isLoggedIn = false;
            isAdmin = false;
            currentUser = null;
            currentGroup = null;
            
            // Masquer le menu utilisateur
            document.getElementById('userMenu').style.display = 'none';
            
            // Afficher les boutons d'authentification
            document.getElementById('authButtons').style.display = 'block';
            
            // Masquer les éléments admin
            document.querySelectorAll('.admin-nav').forEach(el => {
                el.style.display = 'none';
            });
            
            // Désactiver les fonctionnalités réservées aux utilisateurs connectés
            document.getElementById('createGroupBtn').disabled = true;
            document.querySelectorAll('.add-item-form input, .add-item-form textarea, .add-item-form button').forEach(el => {
                el.disabled = true;
                if (el.placeholder && !el.placeholder.includes('Veuillez vous connecter')) {
                    el.placeholder = 'Veuillez vous connecter pour utiliser cette fonctionnalité';
                }
            });
            
            // Masquer la section admin si elle est visible
            document.getElementById('admin').style.display = 'none';
            document.getElementById('tableau-de-bord').style.display = 'none';
            
            // Afficher la section d'accueil
            document.getElementById('accueil').style.display = 'block';
            document.getElementById('groupes').style.display = 'block';
            
            // Supprimer les données de connexion
            localStorage.removeItem('collabspace_loggedIn');
            localStorage.removeItem('collabspace_user');
            localStorage.removeItem('collabspace_isAdmin');
            
            showNotification('Déconnexion réussie', 'success');
        }

        function showAdminSection(e) {
            if (e) e.preventDefault();
            
            if (!isAdmin) {
                showNotification('Accès réservé aux administrateurs', 'error');
                return;
            }
            
            // Masquer les autres sections
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Afficher la section admin
            document.getElementById('admin').style.display = 'block';
            
            // Scroller vers le haut
            window.scrollTo(0, 0);
        }

        function showDashboardSection(e) {
            if (e) e.preventDefault();
            
            if (!isLoggedIn) {
                showNotification('Veuillez vous connecter pour accéder au tableau de bord', 'error');
                return;
            }
            
            // Masquer les autres sections
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Afficher la section dashboard
            document.getElementById('tableau-de-bord').style.display = 'block';
            
            // Charger les données du dashboard
            loadUserProgress();
            
            // Scroller vers le haut
            window.scrollTo(0, 0);
        }

        // Les autres fonctions (handleSearch, validateEmail, showNotification, etc.) restent similaires
        // Pour des raisons de longueur, je vais inclure seulement les fonctions essentielles

        function handleSearch(e) {
            const query = e.target.value.toLowerCase();
            const resultsContainer = document.getElementById('searchResults');
            
            if (query.length < 2) {
                resultsContainer.style.display = 'none';
                return;
            }
            
            const filteredResults = searchData.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
            );
            
            displaySearchResults(filteredResults);
        }

        function displaySearchResults(results) {
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '';
            
            if (results.length === 0) {
                resultsContainer.innerHTML = '<div class="search-result-item">Aucun résultat trouvé</div>';
            } else {
                results.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.className = 'search-result-item';
                    resultElement.innerHTML = `
                        <div><strong>${result.title}</strong> - ${result.type}</div>
                        <div style="font-size: 0.8rem; color: var(--gray);">${result.description}</div>
                    `;
                    resultsContainer.appendChild(resultElement);
                });
            }
            
            resultsContainer.style.display = 'block';
        }

        function showSearchResults() {
            const query = document.getElementById('searchInput').value;
            if (query.length >= 2) {
                document.getElementById('searchResults').style.display = 'block';
            }
        }

        function hideSearchResults() {
            // Petit délai pour permettre le clic sur un résultat
            setTimeout(() => {
                document.getElementById('searchResults').style.display = 'none';
            }, 200);
        }

        function setupFormValidation() {
            // Validation en temps réel pour le formulaire de connexion
            document.getElementById('loginEmail').addEventListener('input', function() {
                if (validateEmail(this.value)) {
                    this.parentElement.classList.remove('error');
                }
            });
            
            document.getElementById('loginPassword').addEventListener('input', function() {
                if (this.value.length >= 1) {
                    this.parentElement.classList.remove('error');
                }
            });
            
            // Validation en temps réel pour le formulaire d'inscription
            document.getElementById('signupName').addEventListener('input', function() {
                if (this.value.length >= 2) {
                    this.parentElement.classList.remove('error');
                }
            });
            
            document.getElementById('signupEmail').addEventListener('input', function() {
                if (validateEmail(this.value)) {
                    this.parentElement.classList.remove('error');
                }
            });
            
            document.getElementById('signupPassword').addEventListener('input', function() {
                if (this.value.length >= 8) {
                    this.parentElement.classList.remove('error');
                }
            });
            
            document.getElementById('signupConfirmPassword').addEventListener('input', function() {
                const password = document.getElementById('signupPassword').value;
                if (this.value === password) {
                    this.parentElement.classList.remove('error');
                }
            });
            
            // Validation en temps réel pour le formulaire de création de groupe
            document.getElementById('newGroupName').addEventListener('input', function() {
                if (this.value.length >= 2) {
                    this.parentElement.classList.remove('error');
                }
            });
            
            // Validation en temps réel pour le formulaire d'invitation
            document.getElementById('inviteeEmail').addEventListener('input', function() {
                if (validateEmail(this.value)) {
                    this.parentElement.classList.remove('error');
                }
            });
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function showNotification(message, type) {
            // Créer une notification temporaire
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
                ${message}
            `;
            
            document.body.appendChild(notification);
            
            // Animation d'entrée
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // Animation de sortie après 3 secondes
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        function initializeCalendar() {
            // Cette fonction est déjà implémentée dans updateCalendarDisplay
        }

        // Fermer les modales en cliquant à l'extérieur
        window.addEventListener('click', function(e) {
            document.querySelectorAll('.modal').forEach(modal => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Fermer le dropdown utilisateur en cliquant à l'extérieur
            if (!e.target.closest('.user-menu')) {
                document.getElementById('userDropdown').classList.remove('active');
            }
        });

        // Vérifier la préférence de mode sombre au chargement
        const savedDarkMode = localStorage.getItem('collabspace_darkMode');
        if (savedDarkMode === 'true') {
            darkMode = true;
            document.body.classList.add('dark-mode');
            document.querySelector('#themeToggle i').classList.remove('fa-moon');
            document.querySelector('#themeToggle i').classList.add('fa-sun');
        }

        // Fermer le menu mobile en cliquant sur un lien
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('navLinks').classList.remove('active');
            });
        });

        // Pour tester l'accès admin, utilisez l'email: admin@collabspace.com (mot de passe:任意)
 