import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from './hooks/useAppStore';
import { NavigationTab, Contact, Campaign, Template } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ContactsView } from './components/ContactsView';
import { StudentOutreachView } from './components/StudentOutreachView';
import { ClientOutreachView } from './components/ClientOutreachView';
import { CampaignsView } from './components/CampaignsView';
import { SequencesView } from './components/SequencesView';
import { TemplatesView } from './components/TemplatesView';
import { AnalyticsView } from './components/AnalyticsView';
import { InboxView } from './components/InboxView';
import { SuppressionView } from './components/SuppressionView';
import { SettingsView } from './components/SettingsView';
import { ErrorBoundary } from './components/ErrorBoundary';

// Modals
import { SearchModal } from './components/SearchModal';
import { CsvImportModal } from './components/CsvImportModal';
import { ContactDetailModal } from './components/ContactDetailModal';
import { CampaignDetailModal } from './components/CampaignDetailModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const {
    contacts,
    campaigns,
    sequences,
    templates,
    suppressionList,
    events,
    currentUser,
    providerSettings,
    stats,
    addContact,
    updateContact,
    deleteContact,
    bulkImportContacts,
    createCampaign,
    sendCampaignNow,
    toggleSequenceStatus,
    addSequenceStep,
    addTemplate,
    addSuppression,
    removeSuppression,
    updateProviderSettings,
    setCurrentUser,
    resetDemoData,
  } = useAppStore();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem('outreach_theme') === 'dark' ||
      (!('outreach_theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('outreach_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('outreach_theme', 'light');
    }
  }, [isDarkMode]);

  // Modal Visibility States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [wizardAutoOpen, setWizardAutoOpen] = useState(false);

  // Keyboard shortcut Cmd+K for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set of lowercase suppressed emails for fast lookup
  const suppressedEmails = useMemo(() => {
    return new Set(suppressionList.map((e) => e.email.toLowerCase()));
  }, [suppressionList]);

  // Handler for creating a campaign and switching tab
  const handleLaunchCampaignWizard = () => {
    setActiveTab('campaigns');
    setWizardAutoOpen(true);
  };

  // Handler when a template is selected for a campaign
  const handleUseTemplateInCampaign = (tpl: Template) => {
    setActiveTab('campaigns');
    setWizardAutoOpen(true);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-150">
        {/* Persistent Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar
          currentTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'create-campaign') {
              handleLaunchCampaignWizard();
            } else {
              setActiveTab(tab);
            }
          }}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          darkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          counts={{
            contacts: stats.totalContacts,
            students: stats.studentContacts,
            clients: stats.clientLeads,
            campaigns: campaigns.length,
            suppression: suppressionList.length,
            replies: events.filter((e) => e.eventType === 'replied').length,
          }}
        />

        {/* Main Content Layout */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Global Header */}
          <Header
            onOpenMobileSidebar={() => setMobileMenuOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onNewCampaign={handleLaunchCampaignWizard}
            darkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
            activeProvider={providerSettings?.activeProvider || 'mock'}
            user={currentUser}
            onResetDemoData={resetDemoData}
            onOpenLoginModal={() => setIsLoginOpen(true)}
          />

          {/* Dynamic Page Views */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl w-full mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                contacts={contacts}
                campaigns={campaigns}
                events={events}
                suppressionCount={suppressionList.length}
                onNavigate={(tab) => {
                  if (tab === 'create-campaign') {
                    handleLaunchCampaignWizard();
                  } else {
                    setActiveTab(tab);
                  }
                }}
                onSelectCampaign={setSelectedCampaign}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignsView
                campaigns={campaigns}
                contacts={contacts}
                templates={templates}
                suppressedEmails={suppressedEmails}
                providerSettings={providerSettings}
                onSendCampaign={sendCampaignNow}
                onSelectCampaign={setSelectedCampaign}
                initialWizardOpen={wizardAutoOpen}
              />
            )}

            {activeTab === 'students' && (
              <StudentOutreachView
                contacts={contacts}
                onSelectContact={setSelectedContact}
                onLaunchCampaign={() => handleLaunchCampaignWizard()}
                onOpenImportModal={() => setIsCsvImportOpen(true)}
              />
            )}

            {activeTab === 'clients' && (
              <ClientOutreachView
                contacts={contacts}
                onSelectContact={setSelectedContact}
                onUpdateLeadStatus={(id, status) => updateContact(id, { leadStatus: status })}
                onLaunchCampaign={handleLaunchCampaignWizard}
              />
            )}

            {activeTab === 'contacts' && (
              <ContactsView
                contacts={contacts}
                onSelectContact={setSelectedContact}
                onOpenImportModal={() => setIsCsvImportOpen(true)}
                onAddContact={addContact}
                onDeleteContact={deleteContact}
                onBulkDelete={(ids) => ids.forEach((id) => deleteContact(id))}
                onBulkTag={(ids, tag) => {
                  ids.forEach((id) => {
                    const c = contacts.find((x) => x.id === id);
                    if (c) {
                      const currentTags = c.tags || [];
                      if (!currentTags.includes(tag)) {
                        updateContact(id, { tags: [...currentTags, tag] });
                      }
                    }
                  });
                }}
              />
            )}

            {activeTab === 'sequences' && (
              <SequencesView
                sequences={sequences}
                templates={templates}
                onToggleStatus={toggleSequenceStatus}
                onAddStep={addSequenceStep}
              />
            )}

            {activeTab === 'templates' && (
              <TemplatesView
                templates={templates}
                contacts={contacts}
                onSaveTemplate={addTemplate}
                onSelectForCampaign={handleUseTemplateInCampaign}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                campaigns={campaigns}
                contacts={contacts}
                events={events}
              />
            )}

            {activeTab === 'inbox' && (
              <InboxView
                events={events}
                contacts={contacts}
                onSelectContact={setSelectedContact}
                onUpdateStatus={(id, status) => updateContact(id, { status })}
              />
            )}

            {activeTab === 'suppression' && (
              <SuppressionView
                suppressionList={suppressionList}
                onAddSuppression={addSuppression}
                onRemoveSuppression={removeSuppression}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={providerSettings}
                onUpdateSettings={updateProviderSettings}
                onResetDemoData={resetDemoData}
                darkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              />
            )}
          </main>
        </div>

        {/* GLOBAL MODALS */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          contacts={contacts}
          campaigns={campaigns}
          templates={templates}
          onSelectContact={(contact) => {
            setSelectedContact(contact);
            setIsSearchOpen(false);
          }}
          onNavigate={(tab) => {
            if (tab === 'create-campaign') {
              handleLaunchCampaignWizard();
            } else {
              setActiveTab(tab);
            }
            setIsSearchOpen(false);
          }}
        />

        <CsvImportModal
          isOpen={isCsvImportOpen}
          onClose={() => setIsCsvImportOpen(false)}
          onImportComplete={(importedContacts) => {
            bulkImportContacts(importedContacts);
            setActiveTab('contacts');
          }}
          existingEmails={new Set(contacts.map((c) => c.email.toLowerCase()))}
          suppressedEmails={suppressedEmails}
        />

        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          events={events}
          onUpdateStatus={(status) => {
            if (selectedContact) {
              updateContact(selectedContact.id, { status });
              setSelectedContact((prev) => (prev ? { ...prev, status } : null));
            }
          }}
          onUpdateLeadStatus={(leadStatus) => {
            if (selectedContact) {
              updateContact(selectedContact.id, { leadStatus });
              setSelectedContact((prev) => (prev ? { ...prev, leadStatus } : null));
            }
          }}
          onAddNote={(note) => {
            if (selectedContact) {
              const cur = selectedContact.notes || [];
              const updated = [...cur, note];
              updateContact(selectedContact.id, { notes: updated });
              setSelectedContact((prev) => (prev ? { ...prev, notes: updated } : null));
            }
          }}
          onAddTag={(tag) => {
            if (selectedContact) {
              const cur = selectedContact.tags || [];
              if (!cur.includes(tag)) {
                const updated = [...cur, tag];
                updateContact(selectedContact.id, { tags: updated });
                setSelectedContact((prev) => (prev ? { ...prev, tags: updated } : null));
              }
            }
          }}
        />

        <CampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          events={events}
        />

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          currentUser={currentUser}
          onSwitchUser={setCurrentUser}
        />
      </div>
    </ErrorBoundary>
  );
}
