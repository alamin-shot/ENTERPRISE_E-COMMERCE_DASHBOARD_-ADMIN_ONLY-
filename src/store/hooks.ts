import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

/**
 * Use instead of plain `useDispatch` — fully typed to AppDispatch.
 * Supports RTK Query thunk dispatch without casting.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Use instead of plain `useSelector` — fully typed to RootState.
 * @example const user = useAppSelector((state) => state.auth.user);
 */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector);
