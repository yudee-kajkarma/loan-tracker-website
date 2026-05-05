import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useLoanStore } from "../stores/loanStore";
import {
    PlusIcon,
    SearchIcon,
    WalletIcon,
    ChevronDownIcon,
    LogoutIcon,
    CogIcon,
} from "./ui/Icon";
import { SearchDropdown } from "./SearchDropdown";

export function TopBar() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const signOut = useAuthStore((s) => s.signOut);
    const fetchLoans = useLoanStore((s) => s.fetchLoans);

    const [search, setSearch] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const searchWrapRef = useRef<HTMLDivElement>(null);
    const addRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (
                searchWrapRef.current &&
                !searchWrapRef.current.contains(e.target as Node)
            ) {
                setSearchOpen(false);
            }
            if (addRef.current && !addRef.current.contains(e.target as Node)) {
                setAddMenuOpen(false);
            }
            if (
                avatarRef.current &&
                !avatarRef.current.contains(e.target as Node)
            ) {
                setAvatarMenuOpen(false);
            }
        }
        window.addEventListener("mousedown", handler);
        return () => window.removeEventListener("mousedown", handler);
    }, []);

    const initials = (user?.email ?? "?")
        .split("@")[0]
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="sticky top-0 z-40 h-[64px] bg-white border-b border-border flex items-center justify-between px-6 gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
                    <WalletIcon size={18} />
                </div>
                <span className="font-bold text-navy text-[16px] hidden sm:block">
                    LoanTracker
                </span>
            </Link>

            {/* Search */}
            <div ref={searchWrapRef} className="flex-1 max-w-[560px] relative">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        <SearchIcon size={18} />
                    </span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setSearchOpen(true)}
                        placeholder="Search by name or phone…"
                        className="w-full h-10 pl-10 pr-3 bg-surface rounded-[10px] text-[14px] text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal/20 focus:bg-white border border-transparent focus:border-teal"
                    />
                </div>
                {searchOpen ? (
                    <SearchDropdown
                        query={search}
                        onSelect={() => {
                            setSearchOpen(false);
                            setSearch("");
                        }}
                        onClose={() => setSearchOpen(false)}
                    />
                ) : null}
            </div>

            {/* Add Loan split button */}
            <div className=" flex justify-end items-center gap-4">
                {" "}
                {/* Spacer to push avatar to right */}
                <div ref={addRef} className="relative shrink-0 hidden sm:block">
                    <div className="flex">
                        <button
                            onClick={() => navigate("/loan/add?type=credit")}
                            className="h-10 px-4 bg-teal text-white text-[14px] font-semibold rounded-l-[10px] hover:opacity-90 inline-flex items-center gap-1.5"
                        >
                            <PlusIcon size={16} />
                            Add Loan
                        </button>
                        <button
                            onClick={() => setAddMenuOpen((v) => !v)}
                            className="h-10 px-2 bg-teal text-white rounded-r-[10px] border-l border-white/20 hover:opacity-90 inline-flex items-center"
                        >
                            <ChevronDownIcon size={16} />
                        </button>
                    </div>
                    {addMenuOpen ? (
                        <div className="absolute top-full mt-1 right-0 w-44 bg-white border border-border rounded-[10px] shadow-card overflow-hidden">
                            <button
                                onClick={() => {
                                    setAddMenuOpen(false);
                                    navigate("/loan/add?type=credit");
                                }}
                                className="w-full text-left px-4 py-2.5 text-[14px] text-navy hover:bg-surface flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-credit" />
                                Add Credit
                            </button>
                            <button
                                onClick={() => {
                                    setAddMenuOpen(false);
                                    navigate("/loan/add?type=debit");
                                }}
                                className="w-full text-left px-4 py-2.5 text-[14px] text-navy hover:bg-surface flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-debit" />
                                Add Debit
                            </button>
                        </div>
                    ) : null}
                </div>
                {/* Avatar */}
                <div ref={avatarRef} className="relative shrink-0">
                    <button
                        onClick={() => setAvatarMenuOpen((v) => !v)}
                        className="w-9 h-9 rounded-full bg-navy text-white text-[12px] font-semibold flex items-center justify-center"
                        aria-label="Account menu"
                    >
                        {initials}
                    </button>
                    {avatarMenuOpen ? (
                        <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-border rounded-[10px] shadow-card overflow-hidden">
                            <div className="px-4 py-3 border-b border-border">
                                <p className="text-[12px] text-muted">
                                    Signed in as
                                </p>
                                <p className="text-[13px] text-navy font-medium truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setAvatarMenuOpen(false);
                                    navigate("/settings");
                                }}
                                className="w-full text-left px-4 py-2.5 text-[14px] text-navy hover:bg-surface flex items-center gap-2"
                            >
                                <CogIcon size={16} />
                                Settings
                            </button>
                            <button
                                onClick={async () => {
                                    setAvatarMenuOpen(false);
                                    await signOut();
                                    navigate("/welcome");
                                }}
                                className="w-full text-left px-4 py-2.5 text-[14px] text-overdue hover:bg-surface flex items-center gap-2"
                            >
                                <LogoutIcon size={16} />
                                Sign out
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
