import mysql.connector
import json

def fetch_contacts():
    # Connect to MySQL
    conn = mysql.connector.connect(
        host='localhost',  # Replace with your MySQL host
        user='root',       # Replace with your MySQL username
        password='your database paasword',       # Replace with your MySQL password
        database='your database name'  # Replace with your database name
    )

    cursor = conn.cursor(dictionary=True)
    
    # Fetch contacts from the database
    cursor.execute("SELECT * FROM Contacts")
    contacts = cursor.fetchall()
    
    # Close connection
    cursor.close()
    conn.close()
    
    return contacts

def update_html(contacts):
    # Open the existing HTML file to update the contact list
    with open('public/index.html', 'r') as file:
        html_content = file.read()

    # Find the placeholder in HTML where contacts will be displayed
    contact_list_placeholder = '<div id="contact-list"></div>'
    
    # Start building the HTML for the contact list
    contact_items = ""
    for contact in contacts:
        contact_items += f"""
        <div class="contact-item">
            <p><strong>Name:</strong> {contact['name']}</p>
            <p><strong>Email:</strong> {contact['email']}</p>
            <p><strong>Phone:</strong> {contact['phone']}</p>
            <button data-id="{contact['id']}" class="delete-button">Delete</button>
        </div>
        """
    
    # Replace the placeholder with actual contact items
    updated_html = html_content.replace(contact_list_placeholder, f'<div id="contact-list">{contact_items}</div>')
    
    # Write the updated HTML content back to the file
    with open('public/index.html', 'w') as file:
        file.write(updated_html)
    
    print("HTML file updated with new contact list.")

if __name__ == '__main__':
    contacts = fetch_contacts()
    update_html(contacts)
