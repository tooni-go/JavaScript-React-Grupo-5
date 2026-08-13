"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "./input";
import { ChevronDown } from "lucide-react";

interface Option { 
  id: string | number; 
  nombre: string; 
}

interface Props {
  options: Option[];
  value: string | number;
  onChange: (val: any) => void;
  placeholder?: string;
}

export function SearchableSelect({ options, value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const selectedOpt = options.find(o => String(o.id) === String(value));
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(o => o.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <Input 
          autoComplete="off"
          placeholder={placeholder || "Buscar..."}
          value={open ? search : (selectedOpt ? selectedOpt.nombre : "")}
          onChange={e => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setSearch("");
            setOpen(true);
          }}
          className="pr-8"
        />
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
      
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white dark:bg-slate-950 shadow-md">
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="p-2 text-sm text-slate-500 text-center">Sin resultados</div>
            ) : (
              filtered.map(opt => (
                <div
                  key={opt.id}
                  className={`cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${String(opt.id) === String(value) ? 'bg-slate-100 dark:bg-slate-800 font-medium' : ''}`}
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {opt.nombre}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
