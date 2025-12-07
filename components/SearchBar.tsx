"use client";

import { useEffect, useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCarSearch } from "@/hooks/useCarSearch";
import { useSearchStore } from "@/store/searchStore";
import { useBookingStore } from "@/store/bookingStore";
import type { SearchCriteria } from "@/store/searchStore";
import { useTranslation, useLanguage } from "./LanguageProvider";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaPlane,
  FaShip,
} from "react-icons/fa";
import { format } from "date-fns";
import { enUS, el as elLocale } from "date-fns/locale";

type LocationType = "airport" | "port" | "region";

const locations: Array<{
  nameEn: string;
  nameEl: string;
  type: LocationType;
}> = [
  {
    nameEn: "Heraklion Airport (HER)",
    nameEl: "Αεροδρόμιο Ηρακλείου (HER)",
    type: "airport",
  },
  {
    nameEn: "Chania Airport (CHQ)",
    nameEl: "Αεροδρόμιο Χανίων (CHQ)",
    type: "airport",
  },
  { nameEn: "Heraklion", nameEl: "Ηράκλειο", type: "region" },
  { nameEn: "Chania", nameEl: "Χανιά", type: "region" },
  { nameEn: "Rethymno", nameEl: "Ρέθυμνο", type: "region" },
  { nameEn: "Lasithi", nameEl: "Λασίθι", type: "region" },
  { nameEn: "Heraklion Port", nameEl: "Λιμάνι Ηρακλείου", type: "port" },
  {
    nameEn: "Souda Port (Chania)",
    nameEl: "Λιμάνι Σούδας (Χανιά)",
    type: "port",
  },
];

const times = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function parseDateFromString(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  if ([year, month, day].some((n) => Number.isNaN(n))) return null;
  return new Date(year, month - 1, day);
}

type Props = {
  initialCriteria?: SearchCriteria | null;
  className?: string;
};

export default function CarRentalSearchBar({
  initialCriteria,
  className,
}: Props) {
  const router = useRouter();
  const t = useTranslation();
  const { lang } = useLanguage();

  useEffect(() => {
    registerLocale("en", enUS);
    registerLocale("el", elLocale);
  }, []);

  const dpLocale = useMemo(() => (lang === "el" ? elLocale : enUS), [lang]);

  const { searchCars } = useCarSearch();
  const { setSearchData } = useSearchStore();
  const { setCriteria } = useBookingStore();
  // -------------------------------

  const [showLateReturnWarning, setShowLateReturnWarning] = useState(false);

  const [pickupDate, setPickupDate] = useState<Date | null>(() =>
    initialCriteria?.pickupDate
      ? parseDateFromString(initialCriteria.pickupDate)
      : null
  );
  const [dropoffDate, setDropoffDate] = useState<Date | null>(() =>
    initialCriteria?.dropoffDate
      ? parseDateFromString(initialCriteria.dropoffDate)
      : null
  );

  const [pickupTime, setPickupTime] = useState(
    initialCriteria?.pickupTime || "10:00"
  );
  const [dropoffTime, setDropoffTime] = useState(
    initialCriteria?.dropoffTime || "10:00"
  );

  const [pickupLocation, setPickupLocation] = useState(
    initialCriteria?.pickupLocation || ""
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    initialCriteria?.dropoffLocation || ""
  );
  const [differentDrop, setDifferentDrop] = useState(
    initialCriteria?.dropoffLocation !== initialCriteria?.pickupLocation &&
      !!initialCriteria?.dropoffLocation
  );

  // Popups
  const [showPickupLocPopup, setShowPickupLocPopup] = useState(false);
  const [showDropoffLocPopup, setShowDropoffLocPopup] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showPickupTimePopup, setShowPickupTimePopup] = useState(false);
  const [showDropoffTimePopup, setShowDropoffTimePopup] = useState(false);

  // -------------------------------
  // FORMATTERS
  // -------------------------------
  const formatForAPI = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Prefill from existing criteria (e.g., when returning to /cars)
  useEffect(() => {
    if (!initialCriteria) return;

    setPickupLocation(initialCriteria.pickupLocation || "");
    setDropoffLocation(
      initialCriteria.dropoffLocation || initialCriteria.pickupLocation || ""
    );
    setPickupTime(initialCriteria.pickupTime || "10:00");
    setDropoffTime(initialCriteria.dropoffTime || "10:00");

    setPickupDate(
      initialCriteria.pickupDate
        ? parseDateFromString(initialCriteria.pickupDate)
        : null
    );
    setDropoffDate(
      initialCriteria.dropoffDate
        ? parseDateFromString(initialCriteria.dropoffDate)
        : null
    );

    setDifferentDrop(
      !!initialCriteria.dropoffLocation &&
        initialCriteria.dropoffLocation !== initialCriteria.pickupLocation
    );
  }, [initialCriteria]);

  // -------------------------------
  // HANDLE SEARCH
  // -------------------------------
  const handleSearch = async () => {
    if (!pickupLocation) {
      toast.error(t("search.toastPickLocation"));
      return;
    }
    if (!pickupDate || !dropoffDate) {
      toast.error(t("search.toastPickDates"));
      return;
    }

    const payload = {
      pickupDate: formatForAPI(pickupDate),
      dropoffDate: formatForAPI(dropoffDate),
      pickupTime,
      dropoffTime,
      pickupLocation,
      dropoffLocation: differentDrop ? dropoffLocation : pickupLocation,
    };

    toast.loading(t("search.toastSearching"));

    try {
      const data = await searchCars(payload);

      // Αποθήκευση στο search store (criteria + αποτελέσματα)
      setSearchData(payload, data);

      // Κρατάμε τα criteria και στο bookingStore για το checkout
      setCriteria(payload);

      toast.dismiss();
      toast.success(t("search.toastFound"));

      // 🔥 καθαρό URL
      router.push("/cars");
    } catch (error) {
      toast.dismiss();
      console.error("Error searching cars", error);
      toast.error(t("search.toastError"));
    }
  };

  return (
    <div
      className={`w-full max-w-6xl mx-auto mt-16 mb-12 px-4 ${className || ""}`}
    >
      {/* MAIN BAR */}
      <div className="flex flex-col md:flex-row items-center bg-[#f3f4f6] rounded-2xl md:rounded-full shadow-lg p-3 md:p-4 gap-3 md:gap-5">
        {/* PICKUP LOCATION */}
        <LocationButton
          label={t("search.pickupLocation")}
          value={pickupLocation}
          placeholder={t("search.selectLocation")}
          icon={<FaMapMarkerAlt className="text-blue-500" />}
          onClick={() => setShowPickupLocPopup(true)}
        />

        {/* DROPOFF LOCATION */}
        {differentDrop && (
          <LocationButton
            label={t("search.dropoffLocation")}
            value={dropoffLocation}
            placeholder={t("search.selectLocation")}
            icon={<FaMapMarkerAlt className="text-blue-500" />}
            onClick={() => setShowDropoffLocPopup(true)}
          />
        )}

        {/* PICKUP DATE */}
        <DateButton
          label={t("search.pickupDate")}
          value={pickupDate ? formatForAPI(pickupDate) : t("search.selectDate")}
          icon={<FaCalendarAlt className="text-blue-500" />}
          onClick={() => setShowDatePopup(true)}
        />

        {/* DROPOFF DATE */}
        <DateButton
          label={t("search.dropoffDate")}
          value={
            dropoffDate ? formatForAPI(dropoffDate) : t("search.selectDate")
          }
          icon={<FaCalendarAlt className="text-blue-500" />}
          onClick={() => setShowDatePopup(true)}
        />

        {/* TIME PICKERS */}
        <TimeButton
          label={t("search.pickupTime")}
          value={pickupTime}
          onClick={() => setShowPickupTimePopup(true)}
        />

        <TimeButton
          label={t("search.dropoffTime")}
          value={dropoffTime}
          onClick={() => setShowDropoffTimePopup(true)}
        />

        {showLateReturnWarning && (
          <p className="text-red-600 text-xs mt-1 font-medium">
            ⚠️ Προσοχή: οι επιστροφές μετά τις 12:00 χρεώνονται ως +1 επιπλέον
            ημέρα.
          </p>
        )}

        {/* SEARCH BTN */}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white flex items-center gap-2 rounded-full px-6 py-3 font-semibold hover:bg-orange-600 transition md:ml-3 shadow-md"
        >
          <FaSearch /> {t("search.searchBtn")}
        </button>
      </div>

      {/* Toggle Different dropoff */}
      <div className="flex items-center gap-4 mt-4 px-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-700">
            {t("search.differentDrop")}
          </span>
          <input
            type="checkbox"
            checked={differentDrop}
            onChange={() => setDifferentDrop(!differentDrop)}
          />
        </label>
      </div>

      {/* POPUPS */}
      {showPickupLocPopup && (
        <LocationPopup
          title={t("search.pickupTitle")}
          onClose={() => setShowPickupLocPopup(false)}
          onSelect={(v) => {
            setPickupLocation(v);
            setShowPickupLocPopup(false);
          }}
        />
      )}

      {showDropoffLocPopup && (
        <LocationPopup
          title={t("search.dropoffTitle")}
          onClose={() => setShowDropoffLocPopup(false)}
          onSelect={(v) => {
            setDropoffLocation(v);
            setShowDropoffLocPopup(false);
          }}
        />
      )}

      {showDatePopup && (
        <DateRangePopup
          title={t("search.dateRangeTitle")}
          startDate={pickupDate}
          endDate={dropoffDate}
          minDate={new Date()}
          onSelect={(start, end) => {
            setPickupDate(start);
            setDropoffDate(end);
            setShowDatePopup(false);
          }}
          onClose={() => setShowDatePopup(false)}
        />
      )}

      {showPickupTimePopup && (
        <TimePopup
          title={t("search.pickupTimeTitle")}
          onSelect={(t) => {
            setPickupTime(t);
            setShowPickupTimePopup(false);
          }}
        />
      )}

      {showDropoffTimePopup && (
        <TimePopup
          title={t("search.dropoffTimeTitle")}
          onSelect={(t) => {
            setDropoffTime(t);
            setShowLateReturnWarning(t > "12:00"); // <-- ΕΛΕΓΧΟΣ
            setShowDropoffTimePopup(false);
          }}
        />
      )}
    </div>
  );
}

// -------------------------------------------------
// SMALL COMPONENTS
// -------------------------------------------------

function LocationButton({ label, value, icon, onClick, placeholder }) {
  return (
    <div className="flex items-center flex-1 border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0 md:pr-4">
      {icon}
      <div className="w-full">
        <label className="text-sm text-gray-500 block">{label}</label>
        <button
          type="button"
          onClick={onClick}
          className="text-left text-gray-700 text-sm truncate w-full"
        >
          {value || placeholder}
        </button>
      </div>
    </div>
  );
}

function DateButton({ label, value, icon, onClick }) {
  return (
    <div className="flex items-center flex-1 border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0 md:pr-4">
      {icon}
      <div>
        <label className="text-sm text-gray-500 block">{label}</label>
        <button
          type="button"
          className="text-sm text-gray-700"
          onClick={onClick}
        >
          {value}
        </button>
      </div>
    </div>
  );
}

function TimeButton({ label, value, onClick }) {
  return (
    <div className="flex items-center flex-1 border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0 md:pr-4">
      <FaClock className="text-blue-500 mr-2" />
      <div>
        <label className="text-sm text-gray-500 block">{label}</label>
        <button onClick={onClick} className="text-sm text-gray-700">
          {value}
        </button>
      </div>
    </div>
  );
}

function addDays(date: Date, days: number) {
  const n = new Date(date);
  n.setDate(n.getDate() + days);
  return n;
}

function LocationPopup({
  title,
  onClose,
  onSelect,
}: {
  title: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  const { lang } = useLanguage();

  const renderIcon = (type: LocationType) => {
    if (type === "airport") return <FaPlane className="text-blue-500" />;
    if (type === "port") return <FaShip className="text-blue-500" />;
    return <FaMapMarkerAlt className="text-blue-500" />;
  };

  return (
    <Overlay onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>

      <div className="max-h-[60vh] overflow-auto rounded-xl border border-gray-200">
        {locations.map((loc) => (
          <button
            key={loc.nameEn}
            onClick={() => onSelect(`${loc.nameEn} / ${loc.nameEl}`)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
          >
            {renderIcon(loc.type)}
            <span className="font-medium text-gray-800">
              {lang === "el"
                ? `${loc.nameEl} / ${loc.nameEn}`
                : `${loc.nameEn} / ${loc.nameEl}`}
            </span>
          </button>
        ))}
      </div>
    </Overlay>
  );
}

function DateRangePopup({
  title,
  startDate,
  endDate,
  minDate,
  onSelect,
  onClose,
}: {
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  minDate?: Date;
  onSelect: (start: Date, end: Date) => void;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const dpLocale = useMemo(() => (lang === "el" ? elLocale : enUS), [lang]);

  const [range, setRange] = useState<[Date | null, Date | null]>([
    startDate,
    endDate,
  ]);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (!start) {
      setRange([null, null]);
      return;
    }
    if (end) {
      const safeEnd = end <= start ? addDays(start, 1) : end;
      setRange([start, safeEnd]);
      onSelect(start, safeEnd);
      onClose();
      return;
    }
    setRange([start, null]);
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const getDayClassName = (date: Date) => {
    const [start, end] = range;
    const today = new Date();
    const classes: string[] = [];

    if (start && isSameDay(date, start)) {
      classes.push("calendar-range-start");
    } else if (end && isSameDay(date, end)) {
      classes.push("calendar-range-end");
    } else if (start && end && date > start && date < end) {
      classes.push("calendar-range-middle");
    }

    if (isSameDay(date, today)) {
      classes.push("calendar-today");
    }

    return classes.join(" ");
  };

  return (
    <Overlay
      onClose={onClose}
      className="w-full max-w-4xl p-4 bg-transparent shadow-none"
    >
      <div className="max-w-4xl bg-white rounded-2xl shadow-lg p-4 border border-gray-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 pr-12">
          {title}
        </h3>
        <DatePicker
          inline
          monthsShown={2}
          selected={range[0]}
          startDate={range[0]}
          endDate={range[1]}
          selectsRange
          minDate={minDate}
          locale={dpLocale}
          dayClassName={getDayClassName}
          calendarClassName="custom-range-calendar"
          onChange={(dates) =>
            handleChange(dates as [Date | null, Date | null])
          }
          renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => (
            <div className="flex items-center justify-between px-3 pb-3 text-base font-semibold text-gray-900">
              <button
                type="button"
                onClick={decreaseMonth}
                className="rounded-full border px-3 py-1 hover:bg-gray-100"
              >
                ←
              </button>
              <span>
                {format(monthDate, "MMMM yyyy", { locale: dpLocale })}
              </span>
              <button
                type="button"
                onClick={increaseMonth}
                className="rounded-full border px-3 py-1 hover:bg-gray-100"
              >
                →
              </button>
            </div>
          )}
        />
      </div>
    </Overlay>
  );
}

function TimePopup({ title, onSelect }) {
  return (
    <Overlay onClose={() => onSelect(null)}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300"
        >
          ✕
        </button>
      </div>

      <div className="max-h-[60vh] overflow-auto mt-3 rounded-xl border border-gray-200">
        {times.map((t) => (
          <button
            key={t}
            onClick={() => onSelect(t)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50"
          >
            {t}
          </button>
        ))}
      </div>
    </Overlay>
  );
}
function Overlay({
  children,
  onClose,
  className,
}: {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={
          className || "w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
