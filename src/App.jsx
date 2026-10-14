import React, { useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [depositorName, setDepositorName] = useState('');
  const [sajuForm, setSajuForm] = useState({
    name: '',
    birthDate: '',
    calendarType: 'solar',
    birthTime: 'unknown',
    interest: 'comprehensive',
    question: ''
  });
  const [validationError, setValidationError] = useState('');
  const [paymentStep, setPaymentStep] = useState('checkout');
  const [readingResult, setReadingResult] = useState(null);

  // 계좌 정보
  const myAccount = {
    bank: '토스뱅크',
    accountNumber: '1002-1526-1128',
    holder: '송시우'
  };

  const products = [
    { id: 'free', name: '오늘의 우주 파동 운세', price: 0, desc: '지구 공전 주기 기반의 일일 공명 주파수 분석' },
    { id: 'custom', name: '천체 자기장 맞춤 리딩', price: 3900, desc: '탄생 시점 태양계 천체 배치가 미친 에너지 벡터' },
    { id: 'comprehensive', name: '시공간 종합 사주론', price: 9900, desc: '양자역학적 확률론 및 음양오행 우주론 심층 분석' },
    { id: 'ai', name: 'AI 천문·사주 심층 상담', price: 4900, desc: '우주론적 알고리즘 기반 1:1 맞춤형 진로·운명 솔루션' },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSajuForm(prev => ({ ...prev, [name]: value }));
  };

  // 과학적 우주론 + 명리학 종합 분석 알고리즘
  const handleSajuSubmit = (e) => {
    e.preventDefault();
    if (!sajuForm.name.trim()) {
      setValidationError('이름 또는 별칭을 입력해주세요.');
      return;
    }
    if (!sajuForm.birthDate) {
      setValidationError('생년월일을 입력해주세요.');
      return;
    }
    setValidationError('');
    
    const birthDateObj = new Date(sajuForm.birthDate);
    const year = birthDateObj.getFullYear();
    const month = birthDateObj.getMonth() + 1;
    const day = birthDateObj.getDate();
    const nameLen = sajuForm.name.length;

    // 우주론적 파동수 계산 (지구 공전 각도 및 생년월일 조합)
    const orbitalAngle = Math.round((month / 12) * 360);
    const quantumVector = (year + month + day + nameLen) % 4;

    // 1. 우주론적 성향 분석 (천체 물리적 고유 기운)
    const cosmicPersonalities = [
      `지구 황도 $${orbitalAngle}^\circ$ 부근의 태양 광자 에너지 밀도가 강한 시기에 태어나, 확산과 발산의 양자 파동을 가집니다. 높은 열정과 뛰어난 추진력으로 주변 환경에 에너지를 공급하는 분입니다.`,
      `태양계 거대 가스 행성(목성·토성)의 중력 섭동이 정밀하게 균형을 이루는 구간에 태어나, 매우 안정적이고 단단한 질량 중심(Center of Mass)을 지닙니다. 냉철한 분석력과 깊은 지혜가 강점입니다.`,
      `지구 자전축 자기장의 미세한 진동 주파수와 깊게 공명하는 생체 에너지를 지니셨습니다. 뛰어난 직관력과 유연한 임기응변으로 변화무쌍한 우주적 변수 속에서도 최적의 궤도를 찾아냅니다.`,
      `우주 고유 물질의 질서정연한 결정 구조(Crystal Structure)를 닮아, 원칙과 신뢰를 바탕으로 삶의 인과율을 명확히 세워나가는 조화로운 공명체를 형성하고 있습니다.`
    ];

    // 2. 오행의 과학적 Re-interpretation (원소와 물질 상태)
    const elementalPhysics = [
      ' [목(木) - 바이오 에너지계]: 유기물 결합과 수목의 성장을 촉진하는 탄소 기반 발산 에너지 형태입니다. 새로운 기획과 시도를 주도하는 강력한 전진 스펙트럼을 보입니다.',
      ' [화(火) - 플라즈마·광자계]: 열역학 제2법칙의 에너지를 광범위하게 방출하는 파동입니다. 타인을 끌어당기는 기질과 화려한 표현력이 뛰어난 전자기적 스펙트럼입니다.',
      ' [금(金) - 고밀도 결정계]: 원자 간 결합력이 단단한 금속성 고체 상태를 연상시키는 정밀한 에너지입니다. 판단이 명확하고 리스크를 최소화하는 안정된 궤도를 그립니다.',
      ' [수(水) - 유체·유동계]: 엔트로피를 극대화하며 어떤 용기든 형태를 맞추는 유체의 물리적 기질입니다. 뛰어난 수용성과 깊은 잠재 지능을 상징합니다.'
    ];

    // 3. 인과율과 확률론 기반 운세 분석
    const quantumRomance = [
      '유사한 진동수를 가진 인연과의 양자 얽힘(Quantum Entanglement) 현상이 강하게 나타납니다. 서로의 공간을 존중할 때 가장 견고한 인력(Gravitational Attraction)이 형성됩니다.',
      '자기장의 N극과 S극처럼 상호 보완적인 상극 기운의 상대와 강한 상호작용을 일으키는 구조입니다. 차이점을 인지할수록 연애 궤도가 더욱 견고해집니다.',
      '은은하고 지속적인 자력선 형태의 대인관계를 형성합니다. 급격한 변화보다는 장기적이고 유기적인 교류에서 깊은 안정을 얻습니다.'
    ];

    const quantumWealth = [
      '에너지 보존 법칙처럼 성실히 축적한 전위차가 곧 재물적 위치 에너지로 변환되는 선형적 구조입니다. 꾸준한 가치 투자가 유효합니다.',
      '계성(Symmetry)이 깨질 때 새로운 기회가 창출되는 비선형적 자산 흐름입니다. 뜻밖의 아이디어나 변곡점에서 큰 재물적 이득을 얻습니다.',
      '질량 보존의 법칙에 따라 가치 있는 자산 중심으로 충동적 이탈을 막는 자성체 구조입니다. 자산의 분산 배치가 행운을 가져다줍니다.'
    ];

    const quantumCareer = [
      '엔지니어링, 정보 처리, 기획 등 복잡한 인과관계를 체계화하고 시스템을 구축하는 분야에서 강한 출력(Power Output)을 발휘합니다.',
      '사람 간의 정보와 감정을 상호 변환하는 아날로그-디지털 인터페이스 역할을 잘 수행합니다. 소통, 미디어, 교육 분야에 우수한 궤도를 지닙니다.',
      '독창적인 스펙트럼을 가진 분야나 주도적 관리가 가능한 궤도에서 가장 높은 효율과 성취를 만들어냅니다.'
    ];

    // 질문 답변
    const questionAnswer = sajuForm.question 
      ? `질문하신 "${sajuForm.question}"에 대해: 현재 당신의 파동은 변곡점을 통과하는 중입니다. 거시적인 흐름을 유지하며 에너지 소비를 최소화하면 관성의 법칙에 따라 자연스럽게 원하는 궤도에 도달할 것입니다.`
      : null;

    setReadingResult({
      name: sajuForm.name,
      birthCoordinates: `${year}년 ${month}월 ${day}일 (황도각 $${orbitalAngle}^\circ$)`,
      personality: cosmicPersonalities[quantumVector],
      elementPhysics: elementalPhysics[month % 4],
      romance: quantumRomance[nameLen % 3],
      wealth: quantumWealth[day % 3],
      career: quantumCareer[(year + month) % 3],
      questionAnswer: questionAnswer
    });

    setCurrentPage('result');
  };

  const handleStartPayment = (product) => {
    setSelectedProduct(product);
    setDepositorName('');
    setPaymentStep('checkout');
    setCurrentPage('payment');
  };

  const handleConfirmDeposit = () => {
    if (!depositorName.trim()) {
      alert('입금자명을 입력해 주세요.');
      return;
    }
    setPaymentStep('complete');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070a13', color: '#f8fafc', paddingBottom: '60px' }}>
      {/* 상단 내비게이션 */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(7, 10, 19, 0.92)', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => setCurrentPage('home')} 
            style={{ background: 'none', border: 'none', color: '#e0f2fe', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>🌌</span> 월운 (月運) — Cosmos Saju
          </button>
          
          <nav style={{ display: 'flex', gap: '24px', fontSize: '15px' }}>
            <button onClick={() => setCurrentPage('home')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>홈</button>
            <button onClick={() => setCurrentPage('input')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>우주 좌표 분석</button>
            <button onClick={() => setCurrentPage('products')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>유료 분석</button>
          </nav>

          <button 
            onClick={() => setCurrentPage('input')}
            style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}
          >
            무료 우주 분석
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        {currentPage === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div style={{ textAlign: 'center', padding: '70px 20px', background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.12) 0%, transparent 70%)', borderRadius: '28px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                🪐 천체물리학 × 고전 명리학의 만남
              </div>
              <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#f0f9ff', marginBottom: '20px', lineHeight: '1.3' }}>
                당신이 탄생한 순간,<br />우주 시공간이 각인한 고유 파동
              </h1>
              <p style={{ color: '#94a3b8', maxWidth: '620px', margin: '0 auto 30px auto', lineHeight: '1.7', fontSize: '15px' }}>
                동양의 음양오행은 단순한 미신이 아닌, <b>지구 자전·공전 주기와 천체 자기장 변화</b>를 관측한 경험 과학입니다. 월운(月運)의 과학적 시공간 알고리즘으로 당신의 삶의 궤도를 정밀하게 추적해 보세요.
              </p>
              <button 
                onClick={() => setCurrentPage('input')}
                style={{ padding: '16px 36px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 25px rgba(56, 189, 248, 0.25)' }}
              >
                우주 시공간 분석 시작 ➔
              </button>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#e0f2fe', marginBottom: '24px', textAlign: 'center' }}>월운 우주론적 서비스</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {products.map(p => (
                  <div key={p.id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f0f9ff', marginBottom: '10px' }}>{p.name}</h3>
                      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>{p.desc}</p>
                    </div>
                    <div>
                      <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '16px', fontSize: '16px' }}>
                        {p.price === 0 ? '무료' : `${p.price.toLocaleString()}원`}
                      </div>
                      <button 
                        onClick={() => p.price === 0 ? setCurrentPage('input') : handleStartPayment(p)}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#070a13', color: '#f8fafc', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                      >
                        {p.price === 0 ? '바로 분석하기' : '신청하기'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'products' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#e0f2fe', marginBottom: '10px', textAlign: 'center' }}>우주론 심층 분석 리포트</h2>
            <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>원하시는 양자 파동 및 정밀 천체 분석 상품을 신청하세요.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {products.map(p => (
                <div key={p.id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f0f9ff', marginBottom: '12px' }}>{p.name}</h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>{p.desc}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '20px' }}>
                      {p.price === 0 ? '무료' : `${p.price.toLocaleString()}원`}
                    </div>
                    <button 
                      onClick={() => p.price === 0 ? setCurrentPage('input') : handleStartPayment(p)}
                      style={{ width: '100%', padding: '14px', backgroundColor: p.price === 0 ? '#334155' : '#38bdf8', color: p.price === 0 ? '#fff' : '#0f172a', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {p.price === 0 ? '무료 이용' : '무통장 입금 신청'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'input' && (
          <div style={{ maxWidth: '550px', margin: '0 auto', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '40px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#e0f2fe', marginBottom: '8px', textAlign: 'center' }}>시공간 좌표 입력</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginBottom: '30px' }}>탄생 시점의 정밀한 정량 데이터를 입력해 주세요.</p>
            
            {validationError && (
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(127, 29, 29, 0.4)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', color: '#fca5a5', fontSize: '14px' }}>
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleSajuSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>이름 또는 관측 식별자</label>
                <input 
                  type="text" 
                  name="name" 
                  value={sajuForm.name} 
                  onChange={handleFormChange}
                  placeholder="홍길동"
                  style={{ width: '100%', padding: '12px', backgroundColor: '#070a13', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>지구 관측 생년월일 (공전 위치)</label>
                <input 
                  type="date" 
                  name="birthDate" 
                  value={sajuForm.birthDate} 
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#070a13', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>달 태양 주기 (양/음력)</label>
                  <select 
                    name="calendarType" 
                    value={sajuForm.calendarType} 
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#070a13', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="solar">태양력 (Solar)</option>
                    <option value="lunar">태음태양력 (Lunar)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>지구 자전 각도 (시간)</label>
                  <select 
                    name="birthTime" 
                    value={sajuForm.birthTime} 
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#070a13', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="unknown">미상 (평균값 적용)</option>
                    <option value="morning">오전 (06:00 ~ 11:59)</option>
                    <option value="afternoon">오후 (12:00 ~ 17:59)</option>
                    <option value="night">야간/새벽</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>분석하고 싶은 양자 변수/질문 (선택)</label>
                <textarea 
                  name="question" 
                  value={sajuForm.question} 
                  onChange={handleFormChange}
                  placeholder="예: 진로 변경이나 이직에 대한 에너지 벡터가 궁금합니다."
                  rows="3"
                  style={{ width: '100%', padding: '12px', backgroundColor: '#070a13', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', color: '#fff', resize: 'none', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <button 
                type="submit"
                style={{ width: '100%', padding: '15px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}
              >
                우주론적 시뮬레이션 실행
              </button>
            </form>
          </div>
        )}

        {currentPage === 'result' && readingResult && (
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
              <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>COSMOS SAJU ANALYSIS REPORT</span>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#f0f9ff', margin: '10px 0 6px 0' }}>{readingResult.name} 님의 우주 파동 리포트</h2>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>관측 좌표: {readingResult.birthCoordinates}</div>
              <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto' }}>{readingResult.personality}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '12px' }}>⚛️ 오행의 원소물리학 해석</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.elementPhysics}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '12px' }}>🌌 양자 얽힘과 인력 (연애·대인관계)</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.romance}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '12px' }}>🔋 열역학 및 위치 에너지 (재물운)</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.wealth}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '12px' }}>🚀 궤도 유지 및 출력 (직업·진로)</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.career}</p>
              </div>
            </div>

            {readingResult.questionAnswer && (
              <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '8px' }}>💬 우주론적 고민 분석 솔루션</h3>
                <p style={{ color: '#f0f9ff', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.questionAnswer}</p>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => setCurrentPage('home')}
                style={{ padding: '14px 32px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
              >
                처음으로 돌아가기
              </button>
            </div>
          </div>
        )}

        {/* 무통장 입금 결제 화면 */}
        {currentPage === 'payment' && selectedProduct && (
          <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '36px', borderRadius: '24px' }}>
            {paymentStep === 'checkout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#e0f2fe', textAlign: 'center' }}>무통장 입금 신청</h2>
                
                <div style={{ padding: '16px', backgroundColor: '#070a13', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>선택한 분석 리포트</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e0f2fe', marginTop: '4px' }}>{selectedProduct.name}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', marginTop: '4px' }}>{selectedProduct.price.toLocaleString()}원</div>
                </div>

                <div style={{ padding: '18px', backgroundColor: 'rgba(56, 189, 248, 0.08)', borderRadius: '14px', border: '1px dashed rgba(56, 189, 248, 0.4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>💳 입금 계좌 정보</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{myAccount.bank} <span style={{ color: '#38bdf8' }}>{myAccount.accountNumber}</span></div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>예금주: {myAccount.holder}</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>입금자명</label>
                  <input 
                    type="text" 
                    value={depositorName} 
                    onChange={(e) => setDepositorName(e.target.value)}
                    placeholder="실제 입금하실 분의 성함"
                    style={{ width: '100%', padding: '12px', backgroundColor: '#070a13', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>※ 입금 확인 후 정밀 우주 파동 리포트가 생성됩니다.</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#334155', color: '#cbd5e1', fontWeight: '600', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleConfirmDeposit}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    입금 완료 신청
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'complete' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                <div style={{ fontSize: '48px' }}>🛰️</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#e0f2fe' }}>입금 확인 신청 완료</h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  <b>{depositorName}</b>님의 입금 신청이 접수되었습니다.<br />
                  입금 확인 후 정밀 우주론 사주 풀이가 진행됩니다.
                </p>
                <div style={{ padding: '14px', backgroundColor: '#070a13', borderRadius: '10px', fontSize: '13px', color: '#94a3b8' }}>
                  문의사항은 카카오톡 채널 또는 이메일로 연락주세요.
                </div>
                <button 
                  onClick={() => setCurrentPage('input')}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                  사주 정보 입력하러 가기
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer style={{ marginTop: '80px', borderTop: '1px solid rgba(56, 189, 248, 0.2)', padding: '30px 20px', textAlign: 'center', backgroundColor: '#070a13', fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p>월운(月運) | 우주론적 사주 풀이 데모</p>
        <p>본 서비스는 천체물리학적 비유 및 명리학적 분석을 결합한 오락·참고용 서비스입니다.</p>
      </footer>
    </div>
  );
}