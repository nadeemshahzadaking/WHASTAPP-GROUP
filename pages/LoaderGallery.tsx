
import React from 'react';
import LoadingCharacter from '../components/LoadingCharacter';
import BackButton from '../components/BackButton';

const LoaderGallery: React.FC = () => {
  const loaders = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 bg-white min-h-screen">
      <BackButton />
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter urdu-font uppercase">
          اینیمیشن کا انتخاب کریں
        </h1>
        <p className="text-slate-500 font-bold text-lg urdu-font">
          نیچے دیے گئے نمبروں میں سے اپنی پسندیدہ لوڈنگ اینیمیشن منتخب کریں اور مجھے نمبر بتائیں۔
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loaders.map((num) => (
          <div 
            key={num} 
            className="bg-slate-50 rounded-[2.5rem] p-8 border-2 border-slate-100 flex flex-col items-center justify-center relative group hover:border-[#25D366] transition-all"
          >
            <div className="absolute top-4 left-6 bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-lg">
              {num}
            </div>
            
            <div className="h-40 flex items-center justify-center">
              <LoadingCharacter version={num} />
            </div>

            <div className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Option No. {num}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-[#25D366]/10 rounded-[3rem] border-2 border-[#25D366]/20 text-center">
        <p className="text-[#128C7E] font-black text-2xl urdu-font">
          "جو نمبر آپ کو سب سے زیادہ پروفیشنل اور فاسٹ لگے، بس وہ بتا دیں!"
        </p>
      </div>
    </div>
  );
};

export default LoaderGallery;
