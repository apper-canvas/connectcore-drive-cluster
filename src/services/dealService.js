class DealService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal';
  }

  async fetchDeals(params = {}) {
    try {
      const fields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'title', 'value', 'stage', 'probability', 'expected_close_date', 'contact'
      ];

      const queryParams = {
        fields: fields,
        ...params
      };

      const response = await this.apperClient.fetchRecords(this.tableName, queryParams);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(deal => ({
        id: deal.Id,
        title: deal.title || '',
        value: parseFloat(deal.value) || 0,
        stage: deal.stage || 'lead',
        probability: parseInt(deal.probability) || 0,
        contactId: deal.contact || null,
        expectedCloseDate: deal.expected_close_date || new Date(),
        createdAt: deal.CreatedOn || new Date(),
        updatedAt: deal.ModifiedOn || new Date()
      }));
    } catch (error) {
      console.error("Error fetching deals:", error);
      throw error;
    }
  }

  async getDealById(dealId) {
    try {
      const fields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'title', 'value', 'stage', 'probability', 'expected_close_date', 'contact'
      ];

      const params = { fields: fields };
      const response = await this.apperClient.getRecordById(this.tableName, dealId, params);
      
      if (!response || !response.data) {
        return null;
      }

      const deal = response.data;
      return {
        id: deal.Id,
        title: deal.title || '',
        value: parseFloat(deal.value) || 0,
        stage: deal.stage || 'lead',
        probability: parseInt(deal.probability) || 0,
        contactId: deal.contact || null,
        expectedCloseDate: deal.expected_close_date || new Date(),
        createdAt: deal.CreatedOn || new Date(),
        updatedAt: deal.ModifiedOn || new Date()
      };
    } catch (error) {
      console.error(`Error fetching deal with ID ${dealId}:`, error);
      throw error;
    }
  }

  async createDeal(dealData) {
    try {
      const record = {
        Name: dealData.title,
        title: dealData.title,
        value: parseFloat(dealData.value) || 0,
        stage: dealData.stage || 'lead',
        probability: parseInt(dealData.probability) || 0,
        expected_close_date: dealData.expectedCloseDate || new Date().toISOString().split('T')[0],
        contact: dealData.contactId || null
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const createdDeal = successfulRecords[0].data;
          return {
            id: createdDeal.Id,
            title: createdDeal.title || '',
            value: parseFloat(createdDeal.value) || 0,
            stage: createdDeal.stage || 'lead',
            probability: parseInt(createdDeal.probability) || 0,
            contactId: createdDeal.contact || null,
            expectedCloseDate: createdDeal.expected_close_date || new Date(),
            createdAt: createdDeal.CreatedOn || new Date(),
            updatedAt: createdDeal.ModifiedOn || new Date()
          };
        }
      }
      throw new Error('Failed to create deal');
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  }

  async updateDeal(dealData) {
    try {
      const record = {
        Id: dealData.id,
        Name: dealData.title,
        title: dealData.title,
        value: parseFloat(dealData.value) || 0,
        stage: dealData.stage || 'lead',
        probability: parseInt(dealData.probability) || 0,
        expected_close_date: dealData.expectedCloseDate || new Date().toISOString().split('T')[0],
        contact: dealData.contactId || null
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedDeal = successfulUpdates[0].data;
          return {
            id: updatedDeal.Id,
            title: updatedDeal.title || '',
            value: parseFloat(updatedDeal.value) || 0,
            stage: updatedDeal.stage || 'lead',
            probability: parseInt(updatedDeal.probability) || 0,
            contactId: updatedDeal.contact || null,
            expectedCloseDate: updatedDeal.expected_close_date || new Date(),
            createdAt: updatedDeal.CreatedOn || new Date(),
            updatedAt: updatedDeal.ModifiedOn || new Date()
          };
        }
      }
      throw new Error('Failed to update deal');
    } catch (error) {
      console.error("Error updating deal:", error);
      throw error;
    }
  }

  async deleteDeal(dealId) {
    try {
      const params = {
        RecordIds: [dealId]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
}

export default new DealService();