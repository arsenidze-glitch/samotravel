import {Suspense} from 'react';
import {notFound} from 'next/navigation';
import {TravelCatalog,TravelDetail} from '@/components/travel-catalog';
import {TravelCheckout} from '@/components/travel-checkout';
import {DestinationPage,InfoPage} from '@/components/travel-info';
import {products} from '@/lib/travel';
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const [root,second]=slug;const product=products.find(p=>p.id===second);let content;
 if(root==='checkout')content=<TravelCheckout/>;
 else if(root==='booking')content=<InfoPage path="manage-booking"/>;
 else if(product)content=<TravelDetail product={product}/>;
 else if(['hotels','flights','cars','packages','activities','transfers','deals'].includes(root))content=<TravelCatalog type={root} destination={second&&second!=='search'?second[0].toUpperCase()+second.slice(1):undefined}/>;
 else if(root==='destinations'||root==='guides')content=<DestinationPage slug={slug.length>1?slug[slug.length-1]:undefined}/>;
 else if(['login','register','forgot-password','reset-password','account','help','contact','manage-booking','terms','privacy','cookies','about'].includes(root))content=<InfoPage path={slug.join('/')}/>;
 else notFound();return <Suspense fallback={<main className="container section">Finding your next good thing…</main>}>{content}</Suspense>}
