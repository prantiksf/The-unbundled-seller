import React from 'react';

const imgWorkspace = "/figma/1098648425577f06b5185200490cc42f387c3a1d.png";
const imgSinglePerson = "/figma/5bdcd63550ec909bf2283b82aa810a3b7b92258c.png";

// SVG imports - these would need to be created separately or imported from a shared SVG file
const imgNotifier = "/figma/notifier.svg";
const imgUnion = "/figma/union-home.svg";
const imgUnion1 = "/figma/union-dms.svg";
const imgUnion2 = "/figma/union-activity.svg";
const imgUnion3 = "/figma/union-agents.svg";
const imgUnion4 = "/figma/union-more.svg";
const imgUnion5 = "/figma/union-action.svg";
const imgUnion6 = "/figma/union-status.svg";

export default function NavBar() {
  return (
    <div className="content-stretch flex flex-col isolate items-center pt-[6px] relative size-full" data-name="Nav Bar" data-node-id="803:59756">
      <div className="content-stretch flex flex-col items-center pb-[20px] relative shrink-0 w-full z-[4]" data-name="Top" data-node-id="I803:59756;10935:72176">
        <div className="content-stretch flex isolate items-center justify-between px-[4px] relative shrink-0 w-[36px]" data-name="Workspace Switcher" data-node-id="I803:59756;10935:72177">
          <div className="absolute bg-[var(--dt_color-theme-base-imp,#eabdfb)] content-stretch flex h-[16px] items-center left-[-22px] px-[5px] rounded-br-[12px] rounded-tr-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] top-[10px] z-[5]" data-name="Count badge" data-node-id="I803:59756;10935:72177;10935:72389">
            <div className="flex flex-col font-['Lato:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[color:var(--dt_color-theme-content-imp,#4a154b)] whitespace-nowrap" data-node-id="I803:59756;10935:72177;10935:72390">
              <p className="leading-[15px]">2</p>
            </div>
          </div>
          <div className="border border-[rgba(0,0,0,0.08)] border-solid overflow-clip relative rounded-[8px] shrink-0 size-[36px] z-[4]" data-name="Workspace" data-node-id="I803:59756;10935:72177;10935:72391">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWorkspace} />
          </div>
          <div className="absolute bg-[var(--dt_color-theme-content-inv-sec,rgba(244,218,255,0.8))] border border-[rgba(0,0,0,0.08)] border-solid left-[2px] opacity-60 rounded-[6px] size-[32px] top-[7px] z-[3]" data-name="Workspace 2" data-node-id="I803:59756;10935:72177;10935:72393" />
          <div className="absolute bg-[var(--dt_color-theme-content-inv-sec,rgba(244,218,255,0.8))] border border-[var(--dt_color-surf-sec,rgba(29,28,29,0.25))] border-solid left-[5px] opacity-40 rounded-[5px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] size-[26px] top-[16px] z-[2]" data-name="Workspace 3" data-node-id="I803:59756;10935:72177;10935:72394" />
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-center min-h-px min-w-px relative w-full z-[3]" data-name="Middle" data-node-id="I803:59756;10935:72178">
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 z-[1]" data-name="Tab Bar" data-node-id="I803:59756;10935:72179">
          <div className="content-stretch flex gap-[12px] isolate items-center justify-center p-[8px] relative rounded-[12px] shrink-0 size-[52px]" data-name="Tab - Home" data-node-id="I803:59756;10935:72179;10935:72274">
            <p className="-translate-x-1/2 absolute bottom-[14px] font-['Lato:Bold',sans-serif] leading-[12px] left-1/2 not-italic overflow-hidden text-[11px] text-[color:var(--dt_color-theme-content-inv-pry,white)] text-center text-ellipsis translate-y-full w-[68px] whitespace-nowrap z-[4]" data-node-id="I803:59756;10935:72179;10935:72274;10935:72358">
              Home
            </p>
            <div className="absolute right-[12px] size-[6px] top-[4px] z-[3]" data-name="Notifier" data-node-id="I803:59756;10935:72179;10935:72274;10935:72359">
              <img alt="" className="block max-w-none size-full" src={imgNotifier} />
            </div>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[24px] top-[calc(50%-8px)] z-[2]" data-name="Icon" data-node-id="I803:59756;10935:72179;10935:72274;10935:72360">
              <div className="absolute inset-[8%_8.13%_7.5%_8.12%]" data-name="Union" data-node-id="I803:59756;10935:72179;10935:72274;10935:72360;15263:63">
                <img alt="" className="block max-w-none size-full" src={imgUnion} />
              </div>
            </div>
            <div className="absolute bg-[var(--dt_color-theme-surf-inv-pry,rgba(249,237,255,0.25))] h-[36px] left-[8px] right-[8px] rounded-[8px] top-0 z-[1]" data-name="Backing" data-node-id="I803:59756;10935:72179;10935:72274;10935:72361" />
          </div>
          <div className="content-stretch flex gap-[12px] isolate items-center justify-center p-[8px] relative shrink-0 size-[52px]" data-name="Tab - DMs" data-node-id="I803:59756;10935:72179;10935:72275">
            <div className="absolute bg-[var(--dt_color-theme-base-imp,#eabdfb)] content-stretch flex h-[16px] items-center px-[5px] right-[2px] rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] top-[-4px] z-[5]" data-name="Badge" data-node-id="I803:59756;10935:72179;10935:72275;10935:72342">
              <div className="flex flex-col font-['Lato:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[color:var(--dt_color-theme-content-imp,#4a154b)] whitespace-nowrap" data-node-id="I803:59756;10935:72179;10935:72275;10935:72343">
                <p className="leading-[15px]">1</p>
              </div>
            </div>
            <p className="-translate-x-1/2 absolute bottom-[14px] font-['Lato:Bold',sans-serif] leading-[12px] left-1/2 not-italic overflow-hidden text-[11px] text-[color:var(--dt_color-theme-content-inv-pry,white)] text-center text-ellipsis translate-y-full w-[68px] whitespace-nowrap z-[4]" data-node-id="I803:59756;10935:72179;10935:72275;10935:72344">
              DMs
            </p>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[20px] top-[calc(50%-8px)] z-[2]" data-name="Icon" data-node-id="I803:59756;10935:72179;10935:72275;10935:72346">
              <div className="absolute inset-[7.5%]" data-name="Union" data-node-id="I803:59756;10935:72179;10935:72275;10935:72346;15068:127">
                <img alt="" className="block max-w-none size-full" src={imgUnion1} />
              </div>
            </div>
            <div className="absolute bg-[var(--dt_color-theme-content-inv-sec,rgba(244,218,255,0.8))] left-[8px] opacity-0 rounded-[8px] size-[36px] top-0 z-[1]" data-name="Backing" data-node-id="I803:59756;10935:72179;10935:72275;10935:72347" />
          </div>
          <div className="content-stretch flex gap-[12px] isolate items-center justify-center p-[8px] relative shrink-0 size-[52px]" data-name="Tab - Activity" data-node-id="I803:59756;10935:72179;10935:72276">
            <div className="absolute bg-[var(--dt_color-theme-base-imp,#eabdfb)] content-stretch flex h-[16px] items-center px-[5px] right-[2px] rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] top-[-4px] z-[5]" data-name="Badge" data-node-id="I803:59756;10935:72179;10935:72276;10935:72342">
              <div className="flex flex-col font-['Lato:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[color:var(--dt_color-theme-content-imp,#4a154b)] whitespace-nowrap" data-node-id="I803:59756;10935:72179;10935:72276;10935:72343">
                <p className="leading-[15px]">1</p>
              </div>
            </div>
            <p className="-translate-x-1/2 absolute bottom-[14px] font-['Lato:Bold',sans-serif] leading-[12px] left-1/2 not-italic overflow-hidden text-[11px] text-[color:var(--dt_color-theme-content-inv-pry,white)] text-center text-ellipsis translate-y-full w-[68px] whitespace-nowrap z-[4]" data-node-id="I803:59756;10935:72179;10935:72276;10935:72344">
              Activity
            </p>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[20px] top-[calc(50%-8px)] z-[2]" data-name="Icon" data-node-id="I803:59756;10935:72179;10935:72276;10935:72346">
              <div className="absolute inset-[7.5%_7.51%_7.5%_7.5%]" data-name="Union" data-node-id="I803:59756;10935:72179;10935:72276;10935:72346;15074:310">
                <img alt="" className="block max-w-none size-full" src={imgUnion2} />
              </div>
            </div>
            <div className="absolute bg-[var(--dt_color-theme-content-inv-sec,rgba(244,218,255,0.8))] left-[8px] opacity-0 rounded-[8px] size-[36px] top-0 z-[1]" data-name="Backing" data-node-id="I803:59756;10935:72179;10935:72276;10935:72347" />
          </div>
          <div className="content-stretch flex gap-[12px] isolate items-center justify-center p-[8px] relative rounded-[12px] shrink-0 size-[52px]" data-name="Tab - Later" data-node-id="I803:59756;10935:72179;10935:72277">
            <p className="-translate-x-1/2 absolute bottom-[14px] font-['Lato:Bold',sans-serif] leading-[12px] left-1/2 not-italic overflow-hidden text-[11px] text-[color:var(--dt_color-theme-content-inv-pry,white)] text-center text-ellipsis translate-y-full w-[68px] whitespace-nowrap z-[4]" data-node-id="I803:59756;10935:72179;10935:72277;10935:72351">
              Agents
            </p>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[20px] top-[calc(50%-8px)] z-[2]" data-name="Icon" data-node-id="I803:59756;10935:72179;10935:72277;10935:72353">
              <div className="absolute inset-[7.5%]" data-name="Union" data-node-id="I803:59756;10935:72179;10935:72277;10935:72353;25053:243">
                <img alt="" className="block max-w-none size-full" src={imgUnion3} />
              </div>
            </div>
            <div className="absolute bg-[var(--dt_color-theme-surf-inv-pry,rgba(249,237,255,0.25))] h-[36px] left-[8px] right-[8px] rounded-[8px] top-0 z-[1]" data-name="Backing" data-node-id="I803:59756;10935:72179;10935:72277;10935:72354" />
          </div>
          <div className="content-stretch flex gap-[12px] isolate items-center justify-center p-[8px] relative shrink-0 size-[52px]" data-name="Tab - More" data-node-id="I803:59756;10935:72179;10935:72281">
            <p className="-translate-x-1/2 absolute bottom-[14px] font-['Lato:Bold',sans-serif] leading-[12px] left-1/2 not-italic overflow-hidden text-[11px] text-[color:var(--dt_color-theme-content-inv-pry,white)] text-center text-ellipsis translate-y-full w-[68px] whitespace-nowrap z-[4]" data-node-id="I803:59756;10935:72179;10935:72281;10935:72344">
              More
            </p>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[20px] top-[calc(50%-8px)] z-[2]" data-name="Icon" data-node-id="I803:59756;10935:72179;10935:72281;10935:72346">
              <div className="absolute inset-[41.25%_10%]" data-name="Union" data-node-id="I803:59756;10935:72179;10935:72281;10935:72346;15068:145">
                <img alt="" className="block max-w-none size-full" src={imgUnion4} />
              </div>
            </div>
            <div className="absolute bg-[var(--dt_color-theme-content-inv-sec,rgba(244,218,255,0.8))] left-[8px] opacity-0 rounded-[8px] size-[36px] top-0 z-[1]" data-name="Backing" data-node-id="I803:59756;10935:72179;10935:72281;10935:72347" />
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-center justify-end py-[12px] relative shrink-0 w-full z-[2]" data-name="Bottom" data-node-id="I803:59756;10935:72183">
        <button className="content-stretch cursor-pointer flex gap-[12px] isolate items-center p-[8px] relative rounded-[24px] shrink-0" data-name="Action Button" data-node-id="I803:59756;10935:72185">
          <div className="overflow-clip relative shrink-0 size-[20px] z-[2]" data-name="Icon" data-node-id="I803:59756;10935:72185;10935:72371">
            <div className="absolute inset-[12.5%]" data-name="Union" data-node-id="I803:59756;10935:72185;10935:72371;15074:350">
              <img alt="" className="block max-w-none size-full" src={imgUnion5} />
            </div>
          </div>
          <div className="absolute bg-[var(--dt_color-theme-surf-inv-pry,rgba(249,237,255,0.25))] inset-0 rounded-[18px] z-[1]" data-name="Backing" data-node-id="I803:59756;10935:72185;10935:72372" />
        </button>
        <div className="content-stretch flex flex-col isolate items-center justify-end pt-[24px] relative shrink-0 w-[36px]" data-name="Profile" data-node-id="I803:59756;10935:72187">
          <div className="relative shrink-0 size-[36px] z-[2]" data-name="💻 Single Person" data-node-id="I803:59756;10935:72187;11115:70583">
            <img alt="" className="block max-w-none size-full" height="36" src={imgSinglePerson} width="36" />
            <div className="absolute bottom-[-6px] right-[-6px] size-[20px]" data-name="status-member" data-node-id="I803:59756;10935:72187;11115:70583;10032:26924">
              <div className="absolute inset-[27.5%]" data-name="Union" data-node-id="I803:59756;10935:72187;11115:70583;10032:26924;15074:459">
                <img alt="" className="block max-w-none size-full" src={imgUnion6} />
              </div>
            </div>
          </div>
          <div className="absolute content-stretch flex flex-col isolate items-center justify-center left-0 overflow-clip pb-[12px] pt-[4px] right-0 rounded-tl-[8px] rounded-tr-[8px] top-0 z-[1]" data-name="Status Icon" data-node-id="I803:59756;10935:72187;11115:70584">
            <div className="flex flex-col font-['Lato:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[14px] text-black text-center z-[2]" data-node-id="I803:59756;10935:72187;11115:70585">
              <p className="leading-[16px] whitespace-pre-wrap">🔮</p>
            </div>
            <div className="absolute bg-[var(--dt_color-theme-surf-inv-pry,rgba(249,237,255,0.25))] inset-0 z-[1]" data-name="Backing" data-node-id="I803:59756;10935:72187;11115:70586" />
          </div>
        </div>
      </div>
    </div>
  );
}
