import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ApperIcon from '../components/ApperIcon';
import { useCRM } from '../context/CRMContext';
import ContactForm from '../components/features/ContactForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { formatDate } from '../utils/formatters';

const Contacts = () => {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});

  const filteredContacts = state.contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContact = (contactData) => {
    dispatch({ type: 'ADD_CONTACT', payload: contactData });
    toast.success('Contact added successfully');
    setIsDialogOpen(false);
  };

  const handleUpdateContact = (contactData) => {
    dispatch({ type: 'UPDATE_CONTACT', payload: contactData });
    toast.success('Contact updated successfully');
    setSelectedContact(null);
    setIsDialogOpen(false);
};

  const handleDeleteContact = async (contactId) => {
    setDeleteLoading(prev => ({ ...prev, [contactId]: true }));
    try {
      dispatch({ type: 'DELETE_CONTACT', payload: contactId });
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [contactId]: false }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="crm-button-primary">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedContact ? 'Edit Contact' : 'Add New Contact'}
              </DialogTitle>
            </DialogHeader>
            <ContactForm
              contact={selectedContact}
              onSubmit={selectedContact ? handleUpdateContact : handleAddContact}
              onCancel={() => {
                setSelectedContact(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredContacts.map((contact) => (
          <motion.div key={contact.id} variants={itemVariants}>
            <Card className="crm-card hover:shadow-lg cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crm-blue-500 to-crm-teal-500 flex items-center justify-center text-white font-semibold text-lg">
                      {contact.firstName[0]}{contact.lastName[0]}
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-crm-blue-600 transition-colors">
                        {contact.firstName} {contact.lastName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{contact.position}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsDialogOpen(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Building" className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{contact.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Mail" className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Phone" className="h-4 w-4 text-muted-foreground" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Added {formatDate(contact.createdAt)}</span>
<Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteContact(contact.id)}
                    disabled={deleteLoading[contact.id]}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-6 px-2"
                  >
                    {deleteLoading[contact.id] ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                    ) : (
                      <ApperIcon name="Trash2" className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredContacts.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12"
        >
          <ApperIcon name="Users" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search term' : "Get started by adding your first contact"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsDialogOpen(true)} className="crm-button-primary">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Your First Contact
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Contacts;