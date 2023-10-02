using backend.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Model.Domain;
using backend.Model.DTO.RefDTO;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RefController : ControllerBase
    {
        private readonly IRefRepository refRepository;
        private readonly AppDbContext appDbContext;

        public RefController(IRefRepository refRepository, AppDbContext appDbContext)
        {
            this.refRepository = refRepository;
            this.appDbContext = appDbContext;
        }

        [HttpPost]
        [Route("{refsId:Guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateRef([FromRoute] Guid refsId, [FromBody] CreateRefDTO refDTO)
        {
            var refs = await refRepository.getAllRefs(refsId);

            if (refs.Count == 0) {
                refDTO.Order = 1;
            }
            else if (refs[refs.Count - 1].Order < refDTO.Order)
            {
                refDTO.Order = refs.Count + 1;
            }
            else if (refs[refDTO.Order - 1].Order == refDTO.Order)
            {
                for (int i = refDTO.Order; i <= refs.Count; i++)
                {
                    var oldRef = appDbContext.Ref.FirstOrDefault(x => x.RefsGroupId == refsId && x.Order == i);
                    oldRef.Order = i + 1;
                    appDbContext.Ref.Update(oldRef);
                    appDbContext.SaveChanges();
                }
            }

            var Ref = new Ref()
            {
                URL = refDTO.URL,
                Text = refDTO.Text,
                Type = refDTO.Type,
                Order = refDTO.Order,
                RefsGroupId = refsId
            };

            var RefDTO = await refRepository.createNewRef(Ref);

            return Ok(RefDTO);
        }

        [HttpGet]
        public async Task<IActionResult> getAllRefsByRefsGroupName([FromQuery(Name = "refsGroupName")]string refsGroupName)
        {
            var refs = await refRepository.getAllRefsByRefsGroupName(refsGroupName);
            if (refs == null)
            {
                return BadRequest();
            }

            return Ok(refs);
        }

        [HttpGet]
        [Route("{refsId:Guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllRef([FromRoute] Guid refsId)
        {
            var refs = await refRepository.getAllRefs(refsId);

            for (int i = 0; i < refs.Count; i++)
            {
                if (i == 0) {
                    if (refs[0].Order == (i + 1))
                    {
                        continue;
                    }

                    var oldRef = appDbContext.Ref.FirstOrDefault(x => x.RefsGroupId == refsId && x.Order == refs[0].Order);
                    oldRef.Order = i + 1;
                    appDbContext.Ref.Update(oldRef);
                    appDbContext.SaveChanges();
                }
                else
                {
                    if (refs[i].Order != i + 1)
                    {
                        for (int j = i; j < refs.Count; j++)
                        {
                            if (refs[j].Order == j + 1)
                            {
                                continue;
                            }

                            var oldRef = appDbContext.Ref.FirstOrDefault(x => x.RefsGroupId == refsId && x.Order == refs[j].Order);
                            oldRef.Order = j + 1;
                            refs[j].Order = j + 1;
                            appDbContext.Ref.Update(oldRef);
                            appDbContext.SaveChanges();
                        }
                        break;
                    }
                }
            }

            if ( refs == null)
            {
                return NotFound(new { message = "Nothing was found"});
            }

            return Ok(refs);    
        }

        [HttpDelete]
        [Route("{refId:Guid}")]
        public async Task<IActionResult> DeleteRef([FromRoute] Guid refId)
        {
            var Ref = await refRepository.deleteRef(refId);

            if(Ref == null)
            {
                return Ok(null);
            }

            return Ok(Ref);
        }

        [HttpPut]
        [Route("{refId:Guid}")]
        public async Task<IActionResult> UpdateRef([FromRoute] Guid refId, [FromBody]RefDTO refDTO)
        {
            var newRef = await refRepository.updateRef(refId, refDTO);

            if (newRef == null)
            {
                return NoContent();
            }

            return Ok(newRef);
        }
    }

}
