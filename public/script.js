window.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('add-form');
    const addButton = document.getElementById('add-contact-button');
    const cancelButton = document.getElementById('cancel-add');
    const contactForm = document.getElementById('add-contact-form');
    const contactList = document.getElementById('contact-list');
    const messageContainer = document.getElementById('message');

    // Show form
    addButton.addEventListener('click', () => {
        contactForm.style.display = 'block';
    });

    // Hide form
    cancelButton.addEventListener('click', () => {
        contactForm.style.display = 'none';
    });

    // Add contact
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
         
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        // Check if all fields are filled out
        if (!name || !email || !phone) {
            showMessage('❌ Please fill in all fields!', 'error');
            return;
        }
        
        const res = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone })
        });

        const result = await res.json();

        if (result.message) {
            showMessage(result.message, 'success');
            loadContacts(); // Reload contacts to show the new one
        } else {
            showMessage('❌ Failed to add contact!', 'error');
        }

        contactForm.style.display = 'none';
        alert("Contact successfully added");
        addForm.reset();
    });

    // Search contacts
    document.getElementById('search-button').addEventListener('click', async () => {
        const searchTerm = document.getElementById('search-input').value.trim();
        
        if (!searchTerm) {
            showMessage('🔍 Please enter a name to search!', 'error');
            return;
        }

        const res = await fetch(`/api/contacts/search?term=${searchTerm}`);
        const contacts = await res.json();

        if (contacts.length === 0) {
            showMessage('❌ No contacts found!', 'error');
        } else {
            showMessage('✅ Contacts found!', 'success');
            renderContacts(contacts);
        }
    });

    // Show messages
    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.color = type === 'success' ? 'green' : 'red';
    }

    // Load contacts
    async function loadContacts() {
        const res = await fetch('/api/contacts');
        const contacts = await res.json();
        renderContacts(contacts);
    }

    // Render contacts to the page
    function renderContacts(contacts) {
        contactList.innerHTML = '';
        contacts.forEach(c => {
            contactList.innerHTML += `
                <div class="contact-item">
                    <p><strong>Name:</strong> ${c.Name}</p>
                    <p><strong>Email:</strong> ${c.Email}</p>
                    <p><strong>Phone:</strong> ${c.PhoneNumber}</p>
                </div>
            `;
        });
    }

    loadContacts();
});
