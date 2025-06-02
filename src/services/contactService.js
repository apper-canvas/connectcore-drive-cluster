class ContactService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'contact';
  }

  async fetchContacts(params = {}) {
    try {
      const fields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'first_name', 'last_name', 'email', 'phone', 'company', 'position', 'source'
      ];

      const queryParams = {
        fields: fields,
        ...params
      };

      const response = await this.apperClient.fetchRecords(this.tableName, queryParams);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(contact => ({
        id: contact.Id,
        firstName: contact.first_name || '',
        lastName: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        position: contact.position || '',
        source: contact.source || '',
        tags: contact.Tags ? contact.Tags.split(',') : [],
        createdAt: contact.CreatedOn || new Date(),
        updatedAt: contact.ModifiedOn || new Date()
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }

  async getContactById(contactId) {
    try {
      const fields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'first_name', 'last_name', 'email', 'phone', 'company', 'position', 'source'
      ];

      const params = { fields: fields };
      const response = await this.apperClient.getRecordById(this.tableName, contactId, params);
      
      if (!response || !response.data) {
        return null;
      }

      const contact = response.data;
      return {
        id: contact.Id,
        firstName: contact.first_name || '',
        lastName: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        position: contact.position || '',
        source: contact.source || '',
        tags: contact.Tags ? contact.Tags.split(',') : [],
        createdAt: contact.CreatedOn || new Date(),
        updatedAt: contact.ModifiedOn || new Date()
      };
    } catch (error) {
      console.error(`Error fetching contact with ID ${contactId}:`, error);
      throw error;
    }
  }

  async createContact(contactData) {
    try {
      const record = {
        Name: `${contactData.firstName} ${contactData.lastName}`,
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone || '',
        company: contactData.company || '',
        position: contactData.position || '',
        source: contactData.source || '',
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : ''
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const createdContact = successfulRecords[0].data;
          return {
            id: createdContact.Id,
            firstName: createdContact.first_name || '',
            lastName: createdContact.last_name || '',
            email: createdContact.email || '',
            phone: createdContact.phone || '',
            company: createdContact.company || '',
            position: createdContact.position || '',
            source: createdContact.source || '',
            tags: createdContact.Tags ? createdContact.Tags.split(',') : [],
            createdAt: createdContact.CreatedOn || new Date(),
            updatedAt: createdContact.ModifiedOn || new Date()
          };
        }
      }
      throw new Error('Failed to create contact');
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  }

  async updateContact(contactData) {
    try {
      const record = {
        Id: contactData.id,
        Name: `${contactData.firstName} ${contactData.lastName}`,
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone || '',
        company: contactData.company || '',
        position: contactData.position || '',
        source: contactData.source || '',
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : ''
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedContact = successfulUpdates[0].data;
          return {
            id: updatedContact.Id,
            firstName: updatedContact.first_name || '',
            lastName: updatedContact.last_name || '',
            email: updatedContact.email || '',
            phone: updatedContact.phone || '',
            company: updatedContact.company || '',
            position: updatedContact.position || '',
            source: updatedContact.source || '',
            tags: updatedContact.Tags ? updatedContact.Tags.split(',') : [],
            createdAt: updatedContact.CreatedOn || new Date(),
            updatedAt: updatedContact.ModifiedOn || new Date()
          };
        }
      }
      throw new Error('Failed to update contact');
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  }

  async deleteContact(contactId) {
    try {
      const params = {
        RecordIds: [contactId]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
}

export default new ContactService();