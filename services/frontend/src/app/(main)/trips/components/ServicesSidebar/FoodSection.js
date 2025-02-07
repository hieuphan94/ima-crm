import { salesFoodServices } from '@/data/mocks/salesFoodServicesMock';
import { ServiceType } from '@/data/models/enums';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { mealTypeColors } from './constants/styles';

export default function FoodSection({ openFood, setOpenFood, foodSearchTerm, setFoodSearchTerm }) {
  return (
    <div>
      <button
        onClick={() => setOpenFood(!openFood)}
        className="w-full flex items-center justify-between text-[10px] font-medium p-1 rounded bg-orange-50 text-orange-700 hover:bg-orange-100"
      >
        <span>Dịch vụ ăn uống</span>
        {openFood ? (
          <IoIosArrowDown className="h-2.5 w-2.5" />
        ) : (
          <IoIosArrowForward className="h-2.5 w-2.5" />
        )}
      </button>

      {openFood && (
        <div className="mt-1 space-y-2">
          {Object.entries(salesFoodServices).map(([mealType, services]) => (
            <div key={mealType}>
              {/* <div className={`p-1 rounded ${mealTypeColors[mealType].header}`}>
                <span className="text-[9px] font-medium">{getMealTypeName(mealType)}</span>
              </div> */}
              <div className="mt-1 grid grid-cols-5 gap-0.5">
                {services.map((service) => (
                  <div
                    key={service.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'text/plain',
                        JSON.stringify({
                          type: 'service',
                          data: {
                            ...service,
                            type: ServiceType.FOOD,
                          },
                        })
                      );
                      e.target.classList.add('opacity-50');
                    }}
                    onDragEnd={(e) => {
                      e.target.classList.remove('opacity-50');
                    }}
                    className={`flex flex-col items-center p-1 rounded cursor-move border ${mealTypeColors[mealType].item}`}
                  >
                    {/* <span className="text-[11px]">{service.icon}</span> */}
                    <span className="text-[8px] text-center truncate w-full">
                      {service.name.split(' - ')[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
