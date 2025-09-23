  // État de l'application
        let currentUser = null;
        let isLoggedIn = false;
        let darkMode = false;

        // Données des groupes
        const groupsData = {
            'projet-alpha': {
                name: 'Projet Alpha',
                members: 8,
                tasks: [
                    { id: 1, title: 'Concevoir la maquette', assignedTo: 'Marie Dupont', dueDate: '15/06/2023', priority: 'Élevée', completed: false },
                    { id: 2, title: 'Rédiger le cahier des charges', assignedTo: 'Jean Martin', dueDate: '', priority: '', completed: true },
                    { id: 3, title: 'Développer le module d\'authentification', assignedTo: 'Pierre Leroy', dueDate: '20/06/2023', priority: 'Moyenne', completed: false }
                ],
                messages: [
                    { user: 'Marie Dupont', time: '10:25', content: 'J\'ai terminé la première version de la maquette. Pouvez-vous la vérifier?' },
                    { user: 'Jean Martin', time: '09:45', content: 'La réunion de suivi est prévue pour demain à 14h. N\'oubliez pas!' },
                    { user: 'Pierre Leroy', time: 'Hier, 16:30', content: 'J\'ai rencontré un problème avec l\'API. Quelqu\'un peut m\'aider?' }
                ],
                files: [
                    { name: 'Cahier des charges.pdf', uploadedBy: 'Jean Martin', date: '12/05/2023', size: '2.4 MB', type: 'pdf' },
                    { name: 'Maquette-v1.png', uploadedBy: 'Marie Dupont', date: '10/05/2023', size: '1.8 MB', type: 'image' },
                    { name: 'script-authentification.js', uploadedBy: 'Pierre Leroy', date: '08/05/2023', size: '156 KB', type: 'code' }
                ]
            },
            'equipe-marketing': {
                name: 'Équipe Marketing',
                members: 5,
                tasks: [],
                messages: [],
                files: []
            },
            'developpeurs-web': {
                name: 'Développeurs Web',
                members: 7,
                tasks: [],
                messages: [],
                files: []
            },
            'designers-ux': {
                name: 'Designers UX/UI',
                members: 4,
                tasks: [],
                messages: [],
                files: []
            }
        };

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

            // Gestion de la sélection des groupes
            document.querySelectorAll('.group-list li').forEach(item => {
                item.addEventListener('click', () => {
                    const groupId = item.getAttribute('data-group');
                    selectGroup(groupId);
                });
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

            // Gestion des modales
            document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
            document.getElementById('signupBtn').addEventListener('click', () => openModal('signupModal'));
            document.getElementById('createGroupBtn').addEventListener('click', () => openModal('createGroupModal'));

            document.querySelectorAll('.close-modal').forEach(button => {
                button.addEventListener('click', closeModal);
            });

            // Gestion des formulaires
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            document.getElementById('signupForm').addEventListener('submit', handleSignup);
            document.getElementById('createGroupForm').addEventListener('submit', handleCreateGroup);

            // Gestion du thème sombre
            document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);

            // Initialiser le calendrier
            initializeCalendar();

            // Vérifier si l'utilisateur est déjà connecté (simulation)
            checkLoginStatus();
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

        function selectGroup(groupId) {
            // Mettre à jour la sélection visuelle
            document.querySelectorAll('.group-list li').forEach(li => li.classList.remove('active'));
            document.querySelector(`.group-list li[data-group="${groupId}"]`).classList.add('active');
            
            // Charger les données du groupe
            const group = groupsData[groupId];
            document.getElementById('groupTitle').textContent = group.name;
            document.getElementById('memberCount').textContent = group.members;
            
            // Mettre à jour les tâches
            updateTasksDisplay(group.tasks);
            
            // Mettre à jour les messages
            updateMessagesDisplay(group.messages);
            
            // Mettre à jour les fichiers
            updateFilesDisplay(group.files);
        }

        function updateTasksDisplay(tasks) {
            const tasksContainer = document.getElementById('tasks');
            // Supprimer les tâches existantes (sauf le formulaire d'ajout)
            const addForm = tasksContainer.querySelector('.add-item-form');
            tasksContainer.innerHTML = '<h3>Tâches du groupe</h3>';
            
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
            
            // Réajouter le formulaire d'ajout
            tasksContainer.appendChild(addForm);
            
            // Ajouter les écouteurs d'événements pour les nouvelles tâches
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    // Mettre à jour l'état de la tâche dans les données
                    // (implémentation simplifiée)
                });
            });
        }

        function updateMessagesDisplay(messages) {
            const messagesContainer = document.getElementById('messages');
            // Supprimer les messages existants (sauf le formulaire d'ajout)
            const addForm = messagesContainer.querySelector('.add-item-form');
            messagesContainer.innerHTML = '<h3>Messages du groupe</h3>';
            
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
            
            // Réajouter le formulaire d'ajout
            messagesContainer.appendChild(addForm);
        }

        function updateFilesDisplay(files) {
            const filesContainer = document.getElementById('files');
            // Supprimer les fichiers existants (sauf le formulaire d'ajout)
            const addForm = filesContainer.querySelector('.add-item-form');
            filesContainer.innerHTML = '<h3>Fichiers partagés</h3>';
            
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
            });
            
            // Réajouter le formulaire d'ajout
            filesContainer.appendChild(addForm);
        }

        function addNewTask() {
            const input = document.getElementById('newTaskInput');
            const taskText = input.value.trim();
            
            if (taskText !== '') {
                // Ajouter la tâche aux données (simplifié)
                const currentGroup = document.querySelector('.group-list li.active').getAttribute('data-group');
                const newTask = {
                    id: groupsData[currentGroup].tasks.length + 1,
                    title: taskText,
                    assignedTo: 'Vous',
                    dueDate: '',
                    priority: '',
                    completed: false
                };
                
                groupsData[currentGroup].tasks.push(newTask);
                updateTasksDisplay(groupsData[currentGroup].tasks);
                input.value = '';
            }
        }

        function sendMessage() {
            const input = document.getElementById('newMessageInput');
            const messageText = input.value.trim();
            
            if (messageText !== '') {
                // Ajouter le message aux données (simplifié)
                const currentGroup = document.querySelector('.group-list li.active').getAttribute('data-group');
                const now = new Date();
                const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                
                const newMessage = {
                    user: 'Vous',
                    time: timeString,
                    content: messageText
                };
                
                groupsData[currentGroup].messages.push(newMessage);
                updateMessagesDisplay(groupsData[currentGroup].messages);
                input.value = '';
                
                // Faire défiler vers le bas pour voir le nouveau message
                const messagesContainer = document.getElementById('messages');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'flex';
        }

        function closeModal() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }

        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simulation de connexion
            if (email && password) {
                currentUser = {
                    name: 'John Doe',
                    email: email,
                    avatar: 'JD'
                };
                isLoggedIn = true;
                updateUIAfterLogin();
                closeModal();
                alert('Connexion réussie!');
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        }

        function handleSignup(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }
            
            // Simulation d'inscription
            if (name && email && password) {
                currentUser = {
                    name: name,
                    email: email,
                    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
                };
                isLoggedIn = true;
                updateUIAfterLogin();
                closeModal();
                alert('Inscription réussie! Bienvenue sur CollabSpace.');
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        }

        function handleCreateGroup(e) {
            e.preventDefault();
            const name = document.getElementById('newGroupName').value;
            const description = document.getElementById('newGroupDescription').value;
            const visibility = document.getElementById('newGroupVisibility').value;
            
            if (name) {
                // Ajouter le nouveau groupe aux données
                const groupId = name.toLowerCase().replace(/\s+/g, '-');
                groupsData[groupId] = {
                    name: name,
                    description: description,
                    visibility: visibility,
                    members: 1,
                    tasks: [],
                    messages: [],
                    files: []
                };
                
                // Ajouter le groupe à la liste
                const groupList = document.querySelector('.group-list');
                const newGroupItem = document.createElement('li');
                newGroupItem.setAttribute('data-group', groupId);
                newGroupItem.innerHTML = `<i class="fas fa-users"></i> ${name}`;
                groupList.appendChild(newGroupItem);
                
                // Ajouter l'écouteur d'événements au nouveau groupe
                newGroupItem.addEventListener('click', function() {
                    const groupId = this.getAttribute('data-group');
                    selectGroup(groupId);
                });
                
                closeModal();
                alert('Groupe créé avec succès!');
                
                // Réinitialiser le formulaire
                document.getElementById('createGroupForm').reset();
            } else {
                alert('Veuillez saisir un nom pour le groupe.');
            }
        }

        function updateUIAfterLogin() {
            // Masquer les boutons d'authentification
            document.getElementById('authButtons').style.display = 'none';
            
            // Afficher le menu utilisateur
            document.getElementById('userMenu').style.display = 'flex';
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userAvatar').textContent = currentUser.avatar;
            
            // Activer les fonctionnalités réservées aux utilisateurs connectés
            document.getElementById('createGroupBtn').disabled = false;
            document.querySelectorAll('.add-item-form input, .add-item-form textarea, .add-item-form button').forEach(el => {
                el.disabled = false;
            });
        }

        function checkLoginStatus() {
            // Simulation: vérifier si l'utilisateur est connecté
            // Dans une vraie application, cela vérifierait les cookies/tokens
            const loggedIn = localStorage.getItem('collabspace_loggedIn');
            
            if (loggedIn === 'true') {
                currentUser = {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    avatar: 'JD'
                };
                isLoggedIn = true;
                updateUIAfterLogin();
            } else {
                // Désactiver certaines fonctionnalités pour les utilisateurs non connectés
                document.getElementById('createGroupBtn').disabled = true;
                document.querySelectorAll('.add-item-form input, .add-item-form textarea, .add-item-form button').forEach(el => {
                    el.disabled = true;
                    el.placeholder = 'Veuillez vous connecter pour utiliser cette fonctionnalité';
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

        function initializeCalendar() {
            const calendar = document.querySelector('.calendar');
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth(); // Juin (index 5)
            
            // Déterminer le premier jour du mois
            const firstDay = new Date(year, month, 1);
            const startingDay = firstDay.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
            
            // Ajuster pour commencer le lundi
            const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;
            
            // Déterminer le nombre de jours dans le mois
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Ajouter les jours du mois précédent
            const prevMonth = new Date(year, month, 0);
            const daysInPrevMonth = prevMonth.getDate();
            
            for (let i = adjustedStartingDay - 1; i >= 0; i--) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = daysInPrevMonth - i;
                calendar.appendChild(dayElement);
            }
            
            // Ajouter les jours du mois actuel
            for (let i = 1; i <= daysInMonth; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = i;
                
                // Marquer les jours avec des événements
                if (i === 15 || i === 20 || i === 25) {
                    dayElement.classList.add('has-event');
                    dayElement.title = 'Événement ce jour';
                }
                
                calendar.appendChild(dayElement);
            }
            
            // Compléter avec les jours du mois suivant
            const totalCells = 42; // 6 semaines de 7 jours
            const remainingCells = totalCells - (adjustedStartingDay + daysInMonth);
            
            for (let i = 1; i <= remainingCells; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = i;
                calendar.appendChild(dayElement);
            }
        }

        // Fermer les modales en cliquant à l'extérieur
        window.addEventListener('click', function(e) {
            document.querySelectorAll('.modal').forEach(modal => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });

        // Vérifier la préférence de mode sombre au chargement
        const savedDarkMode = localStorage.getItem('collabspace_darkMode');
        if (savedDarkMode === 'true') {
            darkMode = true;
            document.body.classList.add('dark-mode');
            document.querySelector('#themeToggle i').classList.remove('fa-moon');
            document.querySelector('#themeToggle i').classList.add('fa-sun');
        }