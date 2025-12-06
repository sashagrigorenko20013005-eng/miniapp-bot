// mock/api.js
// simple mock for demo purposes

const mock = {
  settings: {
    animation_enabled: true,
    animation_id: 1, // 0 none,1 snow,2 petals
    animation_density: 0.75
  },
  bookings: [
    // sample bookings
    { id: 1, date: '2025-12-20', time: '09:00', duration_minutes: 60, service: {id:3,title:'Маникюр'}, master: {id:2,name:'Ольга'} },
    { id: 2, date: '2025-12-20', time: '10:30', duration_minutes: 90, service: {id:4,title:'Наращивание ногтей'}, master: {id:1,name:'Ирина'}, parallel: true },
    { id: 3, date: '2025-12-21', time: '14:00', duration_minutes: 60, service: {id:2,title:'Стрижка'}, master: {id:3,name:'Мария'} }
  ]
};

export async function getSettings() {
  // simulate async
  return JSON.parse(JSON.stringify(mock.settings));
}

export async function setSettings(data) {
  Object.assign(mock.settings, data);
  return JSON.parse(JSON.stringify(mock.settings));
}

export async function getBookings(userId = 0) {
  // in demo ignoring userId
  return JSON.parse(JSON.stringify(mock.bookings));
}

export async function getBooking(id) {
  const b = mock.bookings.find(x => x.id === Number(id));
  return b ? JSON.parse(JSON.stringify(b)) : null;
}

// get availability for date (returns slots with bookings)
export async function getAvailability(date) {
  // generate base slots 08:00..17:30 every 30m
  const slots = [];
  const start = 8 * 60;
  const end = 18 * 60;
  for (let t = start; t < end; t += 30) {
    const hh = String(Math.floor(t/60)).padStart(2,'0');
    const mm = String(t%60).padStart(2,'0');
    slots.push({ time: `${hh}:${mm}`, bookings: [] });
  }
  // map bookings to slots for given date
  mock.bookings.filter(b => b.date === date).forEach(b => {
    // find index of start slot
    const [h,m] = b.time.split(':').map(Number);
    const startMin = h*60 + m;
    const dur = b.duration_minutes || 60;
    const count = Math.ceil(dur / 30);
    for (let i=0;i<count;i++){
      const t = startMin + i*30;
      const hh = String(Math.floor(t/60)).padStart(2,'0');
      const mm = String(t%60).padStart(2,'0');
      const slot = slots.find(s => s.time === `${hh}:${mm}`);
      if (slot) slot.bookings.push({...b});
    }
  });

  return { date, slots };
}

export async function deleteBooking(id) {
  const idx = mock.bookings.findIndex(b => b.id === Number(id));
  if (idx >= 0) {
    mock.bookings.splice(idx,1);
    return { success: true };
  }
  return { success: false, error: 'not found' };
}
