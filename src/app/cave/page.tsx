'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, MobileNav, Footer } from '@/components';
import { Button, Card, Input } from '@/components/ui';
import { AuthForm, useAuth } from '@/components/auth';
import { recipientTypes, occasionTypes } from '@/lib/grug-dictionary';
import { createClient } from '@/lib/supabase/client';
import type { SpecialSun } from '@/lib/database.types';
import { Calendar, Plus, Trash2, LogOut, Settings, Check, AlertTriangle } from 'lucide-react';
import { ProductAdmin } from '@/components/admin';

export default function CavePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [specialSuns, setSpecialSuns] = useState<SpecialSun[]>([]);
  const [loadingSuns, setLoadingSuns] = useState(true);
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [newDate, setNewDate] = useState({
    recipient_type: 'wife',
    occasion_type: 'birthday',
    date: '',
    name: '',
  });

  useEffect(() => {
    if (user) {
      fetchSpecialSuns();
      checkAdminStatus();
    } else {
      setLoadingSuns(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user?.id)
      .single();
    setIsAdmin(data?.is_admin || false);
  };

  const fetchSpecialSuns = async () => {
    setLoadingSuns(true);
    const { data, error } = await supabase
      .from('special_suns')
      .select('*')
      .order('date', { ascending: true });
    if (!error && data) setSpecialSuns(data);
    setLoadingSuns(false);
  };

  const handleAddDate = async () => {
    if (!newDate.date || !newDate.name || !user) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('special_suns')
      .insert({
        user_id: user.id,
        name: newDate.name,
        recipient_type: newDate.recipient_type,
        occasion_type: newDate.occasion_type,
        date: newDate.date,
        reminder_days: 7,
      })
      .select()
      .single();
    if (!error && data) {
      setSpecialSuns([...specialSuns, data]);
      setNewDate({ recipient_type: 'wife', occasion_type: 'birthday', date: '', name: '' });
      setIsAddingDate(false);
    }
    setSaving(false);
  };

  const handleRemoveDate = async (id: string) => {
    const { error } = await supabase.from('special_suns').delete().eq('id', id);
    if (!error) setSpecialSuns(specialSuns.filter((sun) => sun.id !== id));
  };

  const handleToggleRemembered = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('special_suns')
      .update({
        man_remembered: !currentValue,
        man_remembered_at: !currentValue ? new Date().toISOString() : null,
      })
      .eq('id', id);
    if (!error) {
      setSpecialSuns(specialSuns.map((sun) =>
        sun.id === id
          ? { ...sun, man_remembered: !currentValue, man_remembered_at: !currentValue ? new Date().toISOString() : null }
          : sun
      ));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const getGrugOccasion = (type: string) =>
    occasionTypes.find((o) => o.id === type)?.grugName || type;

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    target.setFullYear(today.getFullYear());
    if (target < today) target.setFullYear(today.getFullYear() + 1);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getUrgencyStyle = (days: number) => {
    if (days <= 7) return { text: 'text-blood', bg: 'bg-blood/10', border: 'border-blood/20' };
    if (days <= 30) return { text: 'text-fire', bg: 'bg-fire/5', border: 'border-fire/10' };
    return { text: 'text-stone-light', bg: '', border: 'border-stone-dark/40' };
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="font-grug text-sand">Grug thinking...</p>
        </div>
        <MobileNav />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <div className="max-w-md mx-auto px-6 py-12">
          <section className="text-center mb-8">
            <img src="/grug_avatar.png" alt="Grug" className="h-20 w-auto mx-auto mb-4" />
            <h1 className="font-grug text-2xl text-sand mb-2">Man Enter Cave</h1>
            <p className="text-stone-light text-sm">
              Sign in to save important dates and get reminders.
            </p>
          </section>
          <AuthForm />
        </div>
        <MobileNav />
      </div>
    );
  }

  // Logged in
  const urgentSuns = specialSuns.filter((sun) => !sun.man_remembered && getDaysUntil(sun.date) <= 14);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-grug text-2xl text-sand">
              {user.user_metadata?.grug_name || 'Cave Dweller'}&apos;s Cave
            </h1>
            <p className="text-stone-light text-xs mt-0.5">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className={`p-2 rounded-lg transition-colors ${showAdmin ? 'text-fire bg-fire/10' : 'text-stone-light hover:text-sand'}`}
                title="Admin Tools"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="p-2 text-stone-light hover:text-sand transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Panel */}
        {isAdmin && showAdmin && (
          <section className="mb-12">
            <ProductAdmin />
          </section>
        )}

        {/* Urgent Dates Alert */}
        {urgentSuns.length > 0 && (
          <div className="mb-8 rounded-rock border border-blood/20 bg-blood/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-blood" />
              <span className="font-grug text-sm text-blood">COMING UP SOON</span>
            </div>
            <div className="space-y-2">
              {urgentSuns.map((sun) => (
                <div key={sun.id} className="flex items-center justify-between text-sm">
                  <span className="text-sand">{sun.name}&apos;s {getGrugOccasion(sun.occasion_type)}</span>
                  <span className="font-grug text-blood">{getDaysUntil(sun.date)}d</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Suns */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-grug text-lg text-sand flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-light" />
              Important Dates
            </h2>
            <button
              onClick={() => setIsAddingDate(true)}
              className="flex items-center gap-1.5 text-sm text-fire hover:text-fire-light transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="font-grug text-xs">ADD</span>
            </button>
          </div>

          {/* Add Date Form */}
          {isAddingDate && (
            <div className="mb-6 rounded-rock border border-stone-dark/60 bg-cave-light/30 p-5">
              <h3 className="font-grug text-sand text-sm mb-4">New Important Date</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-stone-light mb-1">Who</label>
                  <select
                    value={newDate.recipient_type}
                    onChange={(e) => setNewDate({ ...newDate, recipient_type: e.target.value })}
                    className="input-cave w-full text-sm"
                  >
                    {recipientTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.realName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-light mb-1">Occasion</label>
                  <select
                    value={newDate.occasion_type}
                    onChange={(e) => setNewDate({ ...newDate, occasion_type: e.target.value })}
                    className="input-cave w-full text-sm"
                  >
                    {occasionTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.realName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-light mb-1">Name</label>
                  <Input
                    type="text"
                    placeholder="Their name"
                    value={newDate.name}
                    onChange={(e) => setNewDate({ ...newDate, name: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-light mb-1">Date</label>
                  <Input
                    type="date"
                    value={newDate.date}
                    onChange={(e) => setNewDate({ ...newDate, date: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddDate} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingDate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* List */}
          {loadingSuns ? (
            <p className="text-stone-light text-sm py-8 text-center">Loading...</p>
          ) : specialSuns.length > 0 ? (
            <div className="space-y-2">
              {specialSuns.map((sun) => {
                const days = getDaysUntil(sun.date);
                const urgency = getUrgencyStyle(days);
                const done = sun.man_remembered;

                return (
                  <div
                    key={sun.id}
                    className={`flex items-center gap-3 p-3 rounded-rock border transition-all ${
                      done ? 'opacity-50 border-stone-dark/20' : urgency.border
                    } ${!done ? urgency.bg : ''}`}
                  >
                    {/* Done toggle */}
                    <button
                      onClick={() => handleToggleRemembered(sun.id, done)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        done
                          ? 'bg-moss/30 border-moss text-moss'
                          : 'border-stone-dark hover:border-fire'
                      }`}
                    >
                      {done && <Check className="w-3 h-3" />}
                    </button>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <p className={`text-sm font-grug ${done ? 'text-stone-light line-through' : 'text-sand'}`}>
                        {sun.name}&apos;s {getGrugOccasion(sun.occasion_type)}
                      </p>
                      <p className="text-xs text-stone-light">
                        {new Date(sun.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    {/* Days countdown */}
                    <span className={`font-grug text-xs shrink-0 ${done ? 'text-moss' : urgency.text}`}>
                      {done ? '✓' : `${days}d`}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemoveDate(sun.id)}
                      className="p-1 text-stone-light/40 hover:text-blood transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-light text-sm">
                No important dates yet. Add one and Grug will remind you.
              </p>
            </div>
          )}
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
