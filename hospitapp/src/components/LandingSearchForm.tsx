"use client";

import SearchFormClient from "./SearchFormClient";
import { SearchFormClientProps } from "@/services/cachers/data_caching.service";

export default function LandingSearchForm({
	specialties,
	eps,
}: SearchFormClientProps) {
	return <SearchFormClient specialties={specialties} eps={eps} />;
}
