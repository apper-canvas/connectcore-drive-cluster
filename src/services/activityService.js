class ActivityService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'Activity1';
  }

  async fetchActivities(params = {}) {
    try {
      const fields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'type', 'title', 'description', 'due_date', 'completed', 'contact', 'deal'
      ];

      const queryParams = {
        fields: fields,
        ...params
      };

      const response = await this.apperClient.fetchRecords(this.tableName, queryParams);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(activity => ({
        id: activity.Id,
        type: activity.type || 'task',
        title: activity.title || '',
        description: activity.description || '',
        contactId: activity.contact || null,
        dealId: activity.deal || null,
        dueDate: activity.due_date || new Date(),
        completed: activity.completed || false,
        createdAt: activity.CreatedOn || new Date()
      }));
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  }

  async getActivityById(activityId) {
    try {
      const fields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'type', 'title', 'description', 'due_date', 'completed', 'contact', 'deal'
      ];

      const params = { fields: fields };
      const response = await this.apperClient.getRecordById(this.tableName, activityId, params);
      
      if (!response || !response.data) {
        return null;
      }

      const activity = response.data;
      return {
        id: activity.Id,
        type: activity.type || 'task',
        title: activity.title || '',
        description: activity.description || '',
        contactId: activity.contact || null,
        dealId: activity.deal || null,
        dueDate: activity.due_date || new Date(),
        completed: activity.completed || false,
        createdAt: activity.CreatedOn || new Date()
      };
    } catch (error) {
      console.error(`Error fetching activity with ID ${activityId}:`, error);
      throw error;
    }
  }

  async createActivity(activityData) {
    try {
      const record = {
        Name: activityData.title,
        type: activityData.type || 'task',
        title: activityData.title,
        description: activityData.description || '',
        due_date: activityData.dueDate || new Date().toISOString(),
        completed: activityData.completed || false,
        contact: activityData.contactId || null,
        deal: activityData.dealId || null
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const createdActivity = successfulRecords[0].data;
          return {
            id: createdActivity.Id,
            type: createdActivity.type || 'task',
            title: createdActivity.title || '',
            description: createdActivity.description || '',
            contactId: createdActivity.contact || null,
            dealId: createdActivity.deal || null,
            dueDate: createdActivity.due_date || new Date(),
            completed: createdActivity.completed || false,
            createdAt: createdActivity.CreatedOn || new Date()
          };
        }
      }
      throw new Error('Failed to create activity');
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  }

  async updateActivity(activityData) {
    try {
      const record = {
        Id: activityData.id,
        Name: activityData.title,
        type: activityData.type || 'task',
        title: activityData.title,
        description: activityData.description || '',
        due_date: activityData.dueDate || new Date().toISOString(),
        completed: activityData.completed || false,
        contact: activityData.contactId || null,
        deal: activityData.dealId || null
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedActivity = successfulUpdates[0].data;
          return {
            id: updatedActivity.Id,
            type: updatedActivity.type || 'task',
            title: updatedActivity.title || '',
            description: updatedActivity.description || '',
            contactId: updatedActivity.contact || null,
            dealId: updatedActivity.deal || null,
            dueDate: updatedActivity.due_date || new Date(),
            completed: updatedActivity.completed || false,
            createdAt: updatedActivity.CreatedOn || new Date()
          };
        }
      }
      throw new Error('Failed to update activity');
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  }

  async deleteActivity(activityId) {
    try {
      const params = {
        RecordIds: [activityId]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  }
}

export default new ActivityService();