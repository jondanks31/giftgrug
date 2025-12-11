'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, MobileNav, GrugMascot, Footer, CavePaintings } from '@/components';
import { Button, Card, Input } from '@/components/ui';
import { AuthForm, useAuth } from '@/components/auth';
import { uiText, recipientTypes, occasionTypes } from '@/lib/grug-dictionary';
import { createClient } from '@/lib/supabase/client';
import type { SpecialSun } from '@/lib/database.types';
import { Calendar, Plus, Trash2, Bell, LogOut, Gift, Settings, Check } from 'lucide-react';
import Link from 'next/link';
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

  // Fetch special suns and check admin status when user is logged in
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

    if (!error && data) {
      setSpecialSuns(data);
    }
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
    const { error } = await supabase
      .from('special_suns')
      .delete()
      .eq('id', id);

    if (!error) {
      setSpecialSuns(specialSuns.filter((sun) => sun.id !== id));
    }
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

  const getGrugRecipient = (type: string) => {
    return recipientTypes.find((r) => r.id === type)?.grugName || type;
  };

  const getGrugOccasion = (type: string) => {
    return occasionTypes.find((o) => o.id === type)?.grugName || type;
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const targetDate = new Date(dateStr);
    // Set to this year
    targetDate.setFullYear(today.getFullYear());
    // If date has passed this year, set to next year
    if (targetDate < today) {
      targetDate.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-blood';
    if (days <= 30) return 'text-fire';
    return 'text-moss';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="font-grug text-sand">Grug thinking...</p>
        </div>
        <MobileNav />
      </div>
    );
  }

  // Not logged in - show auth form
  if (!user) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <section className="text-center mb-8">
            <h1 className="font-grug text-3xl md:text-4xl text-sand">
              {uiText.caveHeading}
            </h1>
            <p className="text-stone-light mt-2">{uiText.caveSubheading}</p>
          </section>
          <AuthForm />
        </div>
        <MobileNav />
      </div>
    );
  }

  // Logged in - show cave dashboard
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-8">
          <GrugMascot 
            size="md" 
            customMessage={`Welcome back to cave, ${user.user_metadata?.grug_name || 'Cave Dweller'}!`}
          />
          
          <h1 className="font-grug text-3xl md:text-4xl text-sand mt-4">
            {uiText.caveHeading}
          </h1>
          <p className="text-stone-light">
            Fire-letter: {user.email}
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            {isAdmin && (
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className={`text-sm flex items-center gap-2 ${showAdmin ? 'text-fire' : 'text-stone-light hover:text-fire'}`}
              >
                <Settings className="w-4 h-4" />
                {showAdmin ? 'Hide Admin' : 'Admin Tools'}
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="text-sm text-stone-light hover:text-fire flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Leave Cave
            </button>
          </div>
        </section>

        {/* Admin Panel - Only shows for admins */}
        {isAdmin && showAdmin && (
          <section className="max-w-4xl mx-auto mb-12">
            <ProductAdmin />
          </section>
        )}

        {/* Upcoming Dates Alert */}
        {specialSuns.some((sun) => getDaysUntil(sun.date) <= 14) && (
          <section className="max-w-2xl mx-auto mb-8">
            <Card className="bg-blood/10 border border-blood/30">
              <div className="flex items-start gap-3">
                <Bell className="w-6 h-6 text-blood flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-grug text-lg text-blood">GRUG WARN MAN!</h3>
                  <p className="text-sand text-sm mt-1">
                    Special sun coming soon! Man should start hunting for gift now.
                  </p>
                  <div className="mt-3 space-y-2">
                    {specialSuns
                      .filter((sun) => getDaysUntil(sun.date) <= 14)
                      .map((sun) => (
                        <div key={sun.id} className="flex items-center justify-between">
                          <span className="text-sand">
                            {sun.name}'s {getGrugOccasion(sun.occasion_type)}
                          </span>
                          <span className="text-blood font-grug">
                            {getDaysUntil(sun.date)} suns left!
                          </span>
                        </div>
                      ))}
                  </div>
                  <Link href="/hunt">
                    <Button size="sm" className="mt-3">
                      <Gift className="w-4 h-4 mr-2" />
                      HUNT FOR GIFT NOW
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Special Suns (Important Dates) */}
        <section className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-grug text-xl text-sand flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {uiText.datesHeading}
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddingDate(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {uiText.addDateButton}
            </Button>
          </div>

          {/* Add Date Form */}
          {isAddingDate && (
            <Card className="mb-4">
              <h3 className="font-grug text-lg text-sand mb-4">Add New Special Sun</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-stone-light mb-1">Who this for?</label>
                  <select
                    value={newDate.recipient_type}
                    onChange={(e) => setNewDate({ ...newDate, recipient_type: e.target.value })}
                    className="input-cave w-full"
                  >
                    {recipientTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.grugName} ({type.realName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-stone-light mb-1">What occasion?</label>
                  <select
                    value={newDate.occasion_type}
                    onChange={(e) => setNewDate({ ...newDate, occasion_type: e.target.value })}
                    className="input-cave w-full"
                  >
                    {occasionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.grugName} ({type.realName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-stone-light mb-1">Womanfolk name</label>
                  <Input
                    type="text"
                    placeholder="What man call her?"
                    value={newDate.name}
                    onChange={(e) => setNewDate({ ...newDate, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-stone-light mb-1">When is special sun?</label>
                  <Input
                    type="date"
                    value={newDate.date}
                    onChange={(e) => setNewDate({ ...newDate, date: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleAddDate} disabled={saving}>
                    {saving ? 'Grug saving...' : 'Save Special Sun'}
                  </Button>
                  <Button variant="ghost" onClick={() => setIsAddingDate(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* List of Special Suns */}
          {loadingSuns ? (
            <Card className="text-center py-8">
              <p className="text-stone-light font-grug-speech text-lg">
                Grug looking in cave...
              </p>
            </Card>
          ) : specialSuns.length > 0 ? (
            <div className="space-y-3">
              {specialSuns.map((sun) => {
                const daysUntil = getDaysUntil(sun.date);
                return (
                  <Card key={sun.id} className={sun.man_remembered ? 'opacity-60' : ''}>
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <p className="font-grug text-sand flex items-center gap-2">
                          {sun.man_remembered && <Check className="w-4 h-4 text-moss" />}
                          {sun.name}'s {getGrugOccasion(sun.occasion_type)}
                        </p>
                        <p className="text-sm text-stone-light">
                          {getGrugRecipient(sun.recipient_type)} • {new Date(sun.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-grug text-sm ${sun.man_remembered ? 'text-moss' : getUrgencyColor(daysUntil)}`}>
                          {sun.man_remembered ? 'Done!' : `${daysUntil} suns`}
                        </span>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/hunt?occasion=${sun.occasion_type}&recipient=${sun.recipient_type}`}
                            className="p-2 text-stone-light hover:text-fire transition-colors"
                            title="Hunt for gift"
                          >
                            <Gift className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleRemoveDate(sun.id)}
                            className="p-2 text-stone-light hover:text-blood transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Man Remembered toggle */}
                    <div className="mt-3 pt-3 border-t border-stone-dark">
                      <button
                        onClick={() => handleToggleRemembered(sun.id, sun.man_remembered)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm ${
                          sun.man_remembered 
                            ? 'bg-moss/20 text-moss-light' 
                            : 'bg-stone-dark text-stone-light hover:text-sand'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        {sun.man_remembered ? 'Man Remembered! (click to undo)' : 'Man Remembered'}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-stone-light font-grug-speech text-lg">
                No special suns yet. Add one so Grug remind man!
              </p>
            </Card>
          )}
        </section>

        {/* Cave Paintings (Wishlists) */}
        <section className="max-w-2xl mx-auto mt-12">
          <CavePaintings />
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
