import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
export const AvailabilityCalendar = ({ slots, isEditable = false, onSlotToggle, year = 2026, month = 9 // October 2026
 }) => {
    const [currentMonth, setCurrentMonth] = useState(month);
    const [currentYear, setCurrentYear] = useState(year);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Days in month calculation
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        }
        else {
            setCurrentMonth(prev => prev - 1);
        }
    };
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        }
        else {
            setCurrentMonth(prev => prev + 1);
        }
    };
    const getDateString = (day) => {
        const m = (currentMonth + 1).toString().padStart(2, '0');
        const d = day.toString().padStart(2, '0');
        return `${currentYear}-${m}-${d}`;
    };
    const getSlotForDay = (day) => {
        const dateStr = getDateString(day);
        return slots.find(s => s.date === dateStr);
    };
    const handleDayClick = (day) => {
        const dateStr = getDateString(day);
        const existing = getSlotForDay(day);
        if (isEditable && onSlotToggle) {
            const nextAvailable = existing ? !existing.isAvailable : true;
            const slotType = existing ? existing.timeSlot : 'whole_day';
            onSlotToggle(dateStr, nextAvailable, slotType);
        }
        else if (existing) {
            setSelectedSlot(existing);
        }
    };
    return (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#b1f2ff]">
        <div>
          <h3 className="text-base font-bold text-[#172B25]">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <p className="text-xs text-[#64746D] mt-0.5">
            {isEditable
            ? 'Click any date to toggle your availability or update shift schedule'
            : 'Live schedule for hospital shifts & home patient assistance'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handlePrevMonth} className="p-2 text-[#172B25] hover:bg-[#d8f9ff] border border-[#b1f2ff] rounded-lg transition-colors" title="Previous Month">
            <ChevronLeft className="w-4 h-4"/>
          </button>
          <button type="button" onClick={handleNextMonth} className="p-2 text-[#172B25] hover:bg-[#d8f9ff] border border-[#b1f2ff] rounded-lg transition-colors" title="Next Month">
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 pt-4 text-center">
        {daysOfWeek.map(day => (<div key={day} className="text-xs font-semibold text-[#64746D] py-1">
            {day}
          </div>))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5 mt-2">
        {/* Leading empty spaces */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (<div key={`empty-${i}`} className="h-14 bg-slate-50/50 rounded-xl"/>))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const slot = getSlotForDay(day);
            const isAvailable = slot ? slot.isAvailable : false;
            const isDefined = !!slot;
            return (<button key={`day-${day}`} type="button" onClick={() => handleDayClick(day)} className={`h-14 p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all ${isAvailable
                    ? 'bg-cyan-50/70 border-emerald-300 hover:bg-cyan-100/70'
                    : isDefined
                        ? 'bg-red-50/50 border-red-200 text-slate-500'
                        : 'bg-white border-[#b1f2ff] hover:bg-slate-50 text-[#172B25]'} ${isEditable ? 'cursor-pointer hover:border-[#3dcfff]' : 'cursor-pointer'}`}>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold tabular-nums">{day}</span>
                {isAvailable ? (<CheckCircle2 className="w-3 h-3 text-[#27865C] shrink-0"/>) : isDefined ? (<XCircle className="w-3 h-3 text-[#D9534F] shrink-0"/>) : null}
              </div>

              <div className="text-[10px] truncate leading-tight">
                {isAvailable ? (<span className="text-[#3dcfff] font-semibold">Available</span>) : isDefined ? (<span className="text-[#D9534F]">Booked</span>) : (<span className="text-[#64746D]">Inquire</span>)}
              </div>
            </button>);
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5 pt-3 border-t border-[#b1f2ff] text-xs text-[#64746D] flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#27865C]"/>
          <span>Available for hire</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#D9534F]"/>
          <span>Booked / Hospital shift</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-300"/>
          <span>Contact for custom slot</span>
        </div>
      </div>

      {selectedSlot && (<div className="mt-4 p-3 bg-[#d8f9ff] border border-[#b1f2ff] rounded-xl text-xs flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#172B25]">Date: {selectedSlot.date}</span>
            <span className="mx-2 text-[#64746D]">·</span>
            <span className={selectedSlot.isAvailable ? 'text-[#27865C] font-semibold' : 'text-[#D9534F]'}>
              {selectedSlot.isAvailable ? 'Available' : 'Booked'}
            </span>
            {selectedSlot.notes && (<span className="text-[#64746D] ml-2">({selectedSlot.notes})</span>)}
          </div>
          <button type="button" onClick={() => setSelectedSlot(null)} className="text-xs text-[#3dcfff] font-medium hover:underline">
            Close
          </button>
        </div>)}
    </div>);
};
