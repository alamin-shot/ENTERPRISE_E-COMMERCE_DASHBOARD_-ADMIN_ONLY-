import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  id: string;
  data?: Record<string, unknown>;
}

interface UiState {
  sidebarCollapsed: boolean;
  activeModal: ModalState | null;
  pageTitle: string;
  breadcrumbs: Breadcrumb[];
}

interface Breadcrumb {
  label: string;
  href: string | null;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  activeModal: null,
  pageTitle: "Dashboard",
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    openModal: (state, action: PayloadAction<ModalState>) => {
      state.activeModal = action.payload;
    },

    closeModal: (state) => {
      state.activeModal = null;
    },

    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },

    setBreadcrumbs: (state, action: PayloadAction<Breadcrumb[]>) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  openModal,
  closeModal,
  setPageTitle,
  setBreadcrumbs,
} = uiSlice.actions;

export default uiSlice.reducer;
