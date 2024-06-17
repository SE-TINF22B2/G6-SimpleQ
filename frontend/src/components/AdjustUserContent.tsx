import Button from "./button/Button";
import Dropdown from "./dropdown/Dropdown";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

export enum SortByDef {
	ldr = "ldr",
	likes = "likes",
	dislikes = "dislikes",
	timestamp = "timestamp"
}

export enum SortDirectionDef {
	asc = "asc",
	desc = "desc"
}

interface Props {
	sortBy?: SortByDef;
	setSortBy?: (sortBy: SortByDef) => void;
	sortDirection?: SortDirectionDef;
	setSortDirection?: (sortDirection: SortDirectionDef) => void;
	enableAI?: boolean;
	setEnableAI?: (enableAI: boolean) => void;
	direction?: "right" | "left";
}

export default function AdjustUserContent(props: Props) {
	const { t } = useTranslation();
	
	const items = useMemo(() => {
		let items = [];
		
		if (props.sortBy !== undefined && props.setSortBy !== undefined) {
			const getIcon = () => {
				switch (props.sortBy) {
					case SortByDef.ldr:
						return "fi fi-rr-equality";
					case SortByDef.likes:
						return "fi fi-rr-social-network";
					case SortByDef.dislikes:
						return "fi fi-rr-social-network flipY";
					case SortByDef.timestamp:
						return "fi fi-rr-time-past";
				}
			}
			
			items.push({
				icon: "fi fi-rr-sort",
				label: t('components.adjustUserContent.sortBy.label'),
				items: [
					{
						icon: "fi fi-rr-equality",
						label: t('components.adjustUserContent.sortBy.ldr'),
						shortcut: props.sortBy === SortByDef.ldr ?
							<i className={ "fi fi-rr-check" }/> : undefined,
						onClick: () => props.setSortBy!(SortByDef.ldr)
					},
					{
						icon: "fi fi-rr-social-network",
						label: t('components.adjustUserContent.sortBy.likes'),
						shortcut: props.sortBy === SortByDef.likes ?
							<i className={ "fi fi-rr-check" }/> : undefined,
						onClick: () => props.setSortBy!(SortByDef.likes)
					},
					{
						icon: "fi fi-rr-social-network flipY",
						label: t('components.adjustUserContent.sortBy.dislikes'),
						shortcut: props.sortBy === SortByDef.dislikes ?
							<i className={ "fi fi-rr-check" }/> : undefined,
						onClick: () => props.setSortBy!(SortByDef.dislikes)
					},
					{
						icon: "fi fi-rr-time-past",
						label: t('components.adjustUserContent.sortBy.timestamp'),
						shortcut: props.sortBy === SortByDef.timestamp ?
							<i className={ "fi fi-rr-check" }/> : undefined,
						onClick: () => props.setSortBy!(SortByDef.timestamp)
					}
				],
				shortcut: <i className={ getIcon() }/>
			});
		}
		
		if (props.sortDirection !== undefined && props.setSortDirection !== undefined) {
			let icon = "fi fi-rr-arrow-trend-" + (props.sortDirection === SortDirectionDef.asc ? "up" : "down");
			
			items.push({
				icon: "fi fi-rr-sort-amount-down",
				label: t('components.adjustUserContent.sortDirection.label'),
				items: [
					{
						icon: "fi fi-rr-arrow-trend-up",
						label: t('components.adjustUserContent.sortDirection.asc'),
						shortcut: props.sortDirection === SortDirectionDef.asc ?
							<i className={ "fi fi-rr-check" }/> : undefined,
						onClick: () => props.setSortDirection!(SortDirectionDef.asc)
					},
					{
						icon: "fi fi-rr-arrow-trend-down",
						label: t('components.adjustUserContent.sortDirection.desc'),
						shortcut: props.sortDirection === SortDirectionDef.desc ?
							<i className={ "fi fi-rr-check" }/> : undefined,
						onClick: () => props.setSortDirection!(SortDirectionDef.desc)
					}
				],
				shortcut: <i className={ icon }/>
			});
		}
		
		if (props.enableAI !== undefined && props.setEnableAI !== undefined) {
			items.push({
				icon: "fi fi-rr-brain",
				label: t('components.adjustUserContent.enableAI.label'),
				shortcut: <input type={ "checkbox" }
								 style={ {
									 userSelect: "none",
									 pointerEvents: "none"
								 } }
								 checked={ props.enableAI } tabIndex={ -1 }/>,
				onClick: () => props.setEnableAI!(!props.enableAI)
			});
		}
		
		return items;
	}, [props.enableAI, props.setEnableAI, props.setSortBy, props.setSortDirection, props.sortBy, props.sortDirection]);
	
	return <Dropdown button={ <Button icon={ "fi fi-rr-filter" }>{ t('components.adjustUserContent.button') }</Button> }
					 direction={ props.direction } items={ items }/>
}
