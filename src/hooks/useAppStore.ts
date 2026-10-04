import { useEffect, useState, useMemo, useCallback } from 'react';
import { appStore, AppStoreState } from '../database/store';
import {
  Contact,
  Campaign,
  Sequence,
  SequenceStep,
  Template,
  SuppressionEntry,
  EmailEvent,
  UserProfile,
  ProviderSettings,
  SendingDomain,
} from '../types';

export function useAppStore() {
  const [state, setState] = useState<AppStoreState>(() => appStore.getState());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
    return () => unsubscribe();
  }, []);

  // Compute live stats
  const stats = useMemo(() => {
    const totalContacts = state.contacts.length;
    const studentContacts = state.contacts.filter((c) => c.contactType === 'Student').length;
    const clientLeads = state.contacts.filter((c) => c.contactType === 'Client Lead').length;
    const activeCampaigns = state.campaigns.filter((c) => c.status === 'Sending' || c.status === 'Scheduled').length;

    let totalDelivered = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    let totalReplied = 0;
    let totalBounced = 0;

    state.campaigns.forEach((camp) => {
      totalDelivered += camp.deliveredCount || 0;
      totalOpened += camp.openedCount || 0;
      totalClicked += camp.clickedCount || 0;
      totalReplied += camp.repliedCount || 0;
      totalBounced += camp.bouncedCount || 0;
    });

    const averageOpenRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const averageReplyRate = totalDelivered > 0 ? (totalReplied / totalDelivered) * 100 : 0;

    return {
      totalContacts,
      studentContacts,
      clientLeads,
      activeCampaigns,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalReplied,
      totalBounced,
      averageOpenRate,
      averageReplyRate,
    };
  }, [state.contacts, state.campaigns]);

  // Actions
  const addContact = useCallback((contact: Omit<Contact, 'id' | 'createdAt'>) => {
    return appStore.addContact(contact);
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    appStore.updateContact(id, updates);
  }, []);

  const deleteContact = useCallback((id: string) => {
    appStore.deleteContact(id);
  }, []);

  const bulkImportContacts = useCallback((newContacts: Array<Omit<Contact, 'id' | 'createdAt'>>) => {
    return appStore.bulkAddContacts(newContacts);
  }, []);

  const createCampaign = useCallback(
    (
      campaign: Omit<
        Campaign,
        | 'id'
        | 'createdAt'
        | 'deliveredCount'
        | 'openedCount'
        | 'clickedCount'
        | 'repliedCount'
        | 'bouncedCount'
        | 'unsubscribedCount'
      >
    ) => {
      return appStore.addCampaign(campaign);
    },
    []
  );

  const sendCampaignNow = useCallback(
    async (campaignData: any): Promise<Campaign> => {
      // 1. Create or save campaign record
      const created = appStore.addCampaign({
        name: campaignData.name,
        type: campaignData.type,
        subject: campaignData.subject,
        previewText: campaignData.preheader || campaignData.previewText,
        fromName: campaignData.fromName,
        fromEmail: campaignData.fromEmail,
        replyTo: campaignData.replyTo,
        bodyHtml: campaignData.body || campaignData.bodyHtml || '',
        status: 'Sending',
        audienceDescription: campaignData.audienceDescription,
        totalRecipients: campaignData.totalRecipients || 0,
      });

      // 2. Identify target recipients
      const recipients = state.contacts.filter((c) => {
        if (c.status === 'Unsubscribed' || c.status === 'Bounced') return false;
        if (campaignData.type === 'student' && c.contactType !== 'Student') return false;
        if (campaignData.type === 'client' && c.contactType !== 'Client Lead') return false;
        return true;
      });

      // 3. Dispatch
      await appStore.sendCampaignNow(created.id, recipients);
      return created;
    },
    [state.contacts]
  );

  const toggleSequenceStatus = useCallback((sequenceId: string) => {
    const seq = state.sequences.find((s) => s.id === sequenceId);
    if (!seq) return;
    const newStatus = seq.status === 'Active' ? 'Paused' : 'Active';
    appStore.updateSequence(sequenceId, { status: newStatus });
  }, [state.sequences]);

  const addSequenceStep = useCallback((sequenceId: string, step: SequenceStep) => {
    const seq = state.sequences.find((s) => s.id === sequenceId);
    if (!seq) return;
    const stepWithId: SequenceStep = {
      ...step,
      id: `st_${Date.now()}`,
      stepNumber: step.stepOrder || step.stepNumber || seq.steps.length + 1,
      actionType: 'email',
      content: step.body || step.content || '',
    };
    appStore.updateSequence(sequenceId, {
      steps: [...seq.steps, stepWithId],
    });
  }, [state.sequences]);

  const addTemplate = useCallback((template: Omit<Template, 'id' | 'createdAt'>) => {
    return appStore.addTemplate({
      ...template,
      content: template.body || template.content || '',
    });
  }, []);

  const addSuppression = useCallback(
    (entry: Omit<SuppressionEntry, 'id' | 'createdAt'>) => {
      appStore.addSuppression(entry.email, entry.reason, entry.sourceCampaign || 'Manual UI');
    },
    []
  );

  const removeSuppression = useCallback((id: string) => {
    appStore.removeSuppression(id);
  }, []);

  const updateProviderSettings = useCallback((settings: Partial<ProviderSettings>) => {
    appStore.updateProviderSettings(settings);
  }, []);

  const setCurrentUser = useCallback((user: UserProfile) => {
    appStore.getState().user = user;
    (appStore as any).notify();
  }, []);

  const resetDemoData = useCallback(() => {
    appStore.resetToDemoData();
  }, []);

  return {
    contacts: state.contacts,
    campaigns: state.campaigns,
    sequences: state.sequences,
    templates: state.templates.map((t) => ({
      ...t,
      body: t.content || t.body || '',
      preheader: t.previewText || t.preheader || '',
    })),
    suppressionList: state.suppressionList,
    events: state.emailEvents,
    currentUser: state.user,
    providerSettings: {
      ...state.providerSettings,
      sendingDomains: state.sendingDomains || [],
    },
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
    store: appStore,
  };
}
