using backend.Data;
using backend.Model.Domain;
using backend.Model.DTO.RefsGroupDTO;
using backend.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.Xml;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RefsGroupController : ControllerBase
    {
        private readonly IRefsGroupRepository refsGroupRepository;

        public RefsGroupController(IRefsGroupRepository refsGroupRepository)
        {
            this.refsGroupRepository = refsGroupRepository;
        }

        [HttpGet]
        [Route("{userId:Guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> getRefsGroup([FromRoute] Guid userId)
        {
            var refs = await refsGroupRepository.getRefsGroup(userId.ToString());

            if (refs == null)
            {
                return NotFound(new { message = "There is not a refsgroup with such user id"});
            }

            var refsGroupDTO = new List<RefsGroup>();


            foreach (var item in refs)
            {
                refsGroupDTO.Add(new RefsGroup()
                {
                    Id = item.Id,
                    Name = item.Name,
                    UserId = item.UserId,
                });
            }

            return Ok(refsGroupDTO);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> createRefs([FromBody] CreateRefsGroupDTO refsDTO)
        {
            var Ref = new RefsGroup()
            {
                Name = refsDTO.Name,
                UserId = refsDTO.UserId,
            };

            var res = await refsGroupRepository.createRefsGroup(Ref);
            if (res == null)
            {
                return BadRequest();
            }

            return Ok(res);
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> deleteRef([FromRoute] Guid id)
        {
            var deletedRef = await refsGroupRepository.deleteRefsGroup(id);

            if (deletedRef != null)
            {
                return Ok(deletedRef);
            }

            return BadRequest(new { message = "Something was wrong!"});
        }

        [HttpPut]
        [Route("{id:Guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> updateRefGroup([FromRoute] Guid id, [FromBody] string title)
        {
            var refsGroup = await refsGroupRepository.updaterefsGroup(id, title);

            if (refsGroup != null)
            {
                return Ok();
            }

            return NoContent();
        }
    }
}
